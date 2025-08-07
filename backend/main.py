from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Property Analysis API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Pydantic models
class PropertySummary(BaseModel):
    id: int
    property: str
    price: float
    current_units: int
    current_beds: int
    current_baths: int
    lot_size: float
    additional_units: int

class UnitInput(BaseModel):
    beds: int
    baths: int
    sqft: int
    rent: float
    construction_cost: float

class UnderwritingInput(BaseModel):
    property_id: int
    additional_units: int
    units: List[UnitInput]
    # Optional overrides for existing calculations
    acquisition_price: Optional[float] = None
    down_payment: Optional[float] = 1.0
    acquisition_cost_pct: Optional[float] = 0.04
    cap_rate_at_sale: Optional[float] = 0.0525
    selling_cost: Optional[float] = 0.065
    aum_fee: Optional[float] = 0.02
    expense_ratio: Optional[float] = 0.28
    general_vacancy_pct: Optional[float] = 0.03
    year_complete_construction: Optional[float] = 1.5
    base_rent_growth_rate: Optional[float] = 0.03
    year_of_sale: Optional[int] = 5

class CashFlowProjection(BaseModel):
    year: int
    base_rent_house: float
    base_rent_adu: float
    general_vacancy: float
    effective_gross_income: float
    expenses: float
    noi: float
    property_value: float
    aum_fee: float
    cash_flow_from_operations: float
    proceeds_from_sale_of_property: float
    selling_costs: float
    initial_equity_investment: float
    total_cash_flow_to_equity: float

class UnderwritingResult(BaseModel):
    projections: List[CashFlowProjection]
    metrics: dict

@app.get("/")
async def root():
    return {"message": "Property Analysis API"}

@app.get("/properties", response_model=List[PropertySummary])
async def get_properties():
    try:
        column_names = []
        for i in range(1, 11):
            column_names.append(f"unit_type_{i}_num_units")
        
        # Build the select query with all unit columns
        select_fields = "MLS_ID, address, city, state, zip_code, price, beds, baths, square_feet, days_on_market, lot_size, additional_units"
        select_fields += ", " + ", ".join(column_names)
        
        # Query the all_data_with_analysis table
        response = supabase.table("all_data_with_analysis").select(select_fields).execute()
        

        properties = []
        for row in response.data:
            # Extract additional_units from additional_units (expecting a number only)
            additional_units = 0
            if row.get("additional_units"):
                try:
                    # Try to convert directly to number if it's just a number
                    additional_units = float(row["additional_units"])
                except:
                    additional_units = 0
            
            # Calculate total units by summing up all unit type columns
            total_units = 0
            for i in range(1, 11):
                unit_count = row.get(f"unit_type_{i}_num_units")
                if unit_count is not None:
                    try:
                        total_units += float(unit_count)
                    except:
                        pass  # Skip if not a valid number
            
            properties.append(PropertySummary(
                id=row["MLS_ID"],
                property=f"{row['address']}, {row['city']}, {row['state']} {row['zip_code']}",
                price=row["price"],
                current_units=row.get("beds", 0),  # Using beds as current units proxy
                current_beds=row["beds"],
                current_baths=row["baths"],
                lot_size=row["lot_size"],
                additional_units=additional_units,
                total_units=total_units
            ))
        
        return properties
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching properties: {str(e)}")

def calculate_irr(cash_flows, max_iter=1000, precision=1e-6):
    """Calculate IRR using Newton-Raphson method"""
    rate = 0.1  # Initial guess
    
    for i in range(max_iter):
        npv = sum([cf / (1 + rate)**t for t, cf in enumerate(cash_flows)])
        npv_derivative = sum([-t * cf / (1 + rate)**(t+1) for t, cf in enumerate(cash_flows)])
        
        if abs(npv) < precision:
            return rate
        
        if npv_derivative == 0:
            break
            
        rate = rate - npv / npv_derivative
        
        if rate < -1:
            rate = -0.99
    
    return rate

@app.post("/underwriting", response_model=UnderwritingResult)
async def calculate_underwriting(input_data: UnderwritingInput):
    try:
        # Get property details
        property_response = supabase.table("all_data_with_analysis").select("*").eq("MLS_ID", input_data.property_id).execute()
        
        if not property_response.data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        property_data = property_response.data[0]
        
        # Use provided acquisition price or default from property data
        acquisition_price = input_data.acquisition_price or property_data["price"]
        
        # Calculate total construction cost
        total_construction_cost = sum(unit.construction_cost for unit in input_data.units)
        
        # Calculate base rent for existing house (from property data if available)
        base_rent = property_data.get("base_rent", 6710)  # Default if not in data
        
        # Calculate total ADU rent
        total_adu_rent = sum(unit.rent for unit in input_data.units)
        base_rent_adu = total_adu_rent if total_adu_rent > 0 else 0
        
        # Total equity investment
        total_equity_in = total_construction_cost + acquisition_price * (1 + input_data.acquisition_cost_pct)
        
        # Initialize projections
        projections = []
        years_data = {}
        
        for year in range(0, 6):
            years_data[year] = {
                'base_rent_house': 0,
                'base_rent_adu': 0,
                'general_vacancy': 0,
                'effective_gross_income': 0,
                'expenses': 0,
                'NOI': 0,
                'property_value': 0,
                'aum_fee': 0,
                'cash_flow_from_operations': 0,
                'proceeds_from_sale_of_property': 0,
                'selling_costs': 0,
                'initial_equity_investment': 0,
                'total_cash_flow_to_equity': 0
            }
            
            if year == 0:
                years_data[year]['initial_equity_investment'] = total_equity_in
                projections.append(CashFlowProjection(year=year, **years_data[year]))
                continue
            
            # Calculate base rent for house
            if year > input_data.year_complete_construction:
                years_data[year]['base_rent_house'] = 12 * base_rent * (1 + input_data.base_rent_growth_rate) ** year
            else:
                years_data[year]['base_rent_house'] = 12 * base_rent * (1 + input_data.base_rent_growth_rate) ** year * 0.5
            
            # Calculate ADU rent
            if year + 1 > input_data.year_complete_construction:
                years_data[year]['base_rent_adu'] = 12 * base_rent_adu * (1 + input_data.base_rent_growth_rate) ** year
            else:
                years_data[year]['base_rent_adu'] = 0
            
            # Calculate other metrics
            years_data[year]['general_vacancy'] = input_data.general_vacancy_pct * years_data[year]['base_rent_house']
            years_data[year]['effective_gross_income'] = (
                years_data[year]['base_rent_house'] + 
                years_data[year]['base_rent_adu'] - 
                years_data[year]['general_vacancy']
            )
            years_data[year]['expenses'] = years_data[year]['effective_gross_income'] * input_data.expense_ratio
            years_data[year]['NOI'] = years_data[year]['effective_gross_income'] - years_data[year]['expenses']
            years_data[year]['property_value'] = years_data[year]['NOI'] / input_data.cap_rate_at_sale
            years_data[year]['aum_fee'] = total_equity_in * input_data.aum_fee
            years_data[year]['cash_flow_from_operations'] = years_data[year]['NOI'] - years_data[year]['aum_fee']
            
            # Sale calculations
            if year == input_data.year_of_sale:
                years_data[year]['proceeds_from_sale_of_property'] = years_data[year]['property_value']
                years_data[year]['selling_costs'] = years_data[year]['property_value'] * input_data.selling_cost
            
            years_data[year]['total_cash_flow_to_equity'] = (
                years_data[year]['cash_flow_from_operations'] + 
                years_data[year]['proceeds_from_sale_of_property'] - 
                years_data[year]['selling_costs']
            )
            
            projections.append(CashFlowProjection(year=year, **years_data[year]))
        
        # Calculate metrics
        cash_flows = [proj.total_cash_flow_to_equity for proj in projections]
        initial_investment = projections[0].initial_equity_investment
        
        # Adjust cash flows for IRR calculation
        irr_cash_flows = cash_flows.copy()
        irr_cash_flows[0] = -initial_investment + cash_flows[0]
        
        unlevered_irr = calculate_irr(irr_cash_flows)
        total_returns_to_equity = sum(cash_flows)
        moic = total_returns_to_equity / initial_investment if initial_investment > 0 else 0
        final_noi = projections[-1].noi
        yield_on_cost = final_noi / initial_investment if initial_investment > 0 else 0
        
        metrics = {
            'initial_equity_investment': initial_investment,
            'total_returns_to_equity': total_returns_to_equity,
            'unlevered_irr': unlevered_irr,
            'moic': moic,
            'yield_on_cost': yield_on_cost
        }
        
        return UnderwritingResult(projections=projections, metrics=metrics)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating underwriting: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)