export interface PropertySummary {
  id: string | number;
  property: string;
  price: number;
  current_units: number;
  current_beds: number;
  current_baths: number;
  lot_size: number;
  additional_units: number;
  total_units?: number;
}

export interface UnitInput {
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  construction_cost: number;
  time_to_completion?: number; // months
  start_month?: number; // months from now
  cost_per_sf?: number;
  unit_type?: 'new' | 'renovation';
  auto_rent?: boolean; // whether to auto-lookup rent
}

export interface UnderwritingInput {
  property_id: string | number;
  additional_units: number;
  units: UnitInput[];
  acquisition_price?: number;
  down_payment?: number;
  acquisition_cost_pct?: number;
  cap_rate_at_sale?: number;
  selling_cost?: number;
  aum_fee?: number;
  expense_ratio?: number;
  general_vacancy_pct?: number;
  year_complete_construction?: number;
  base_rent_growth_rate?: number;
  year_of_sale?: number;
}

export interface CashFlowProjection {
  year: number;
  base_rent_house: number;
  base_rent_adu: number;
  general_vacancy: number;
  effective_gross_income: number;
  expenses: number;
  noi: number;
  property_value: number;
  aum_fee: number;
  cash_flow_from_operations: number;
  proceeds_from_sale_of_property: number;
  selling_costs: number;
  initial_equity_investment: number;
  total_cash_flow_to_equity: number;
}

export interface UnderwritingResult {
  projections: CashFlowProjection[];
  metrics: {
    initial_equity_investment: number;
    total_returns_to_equity: number;
    unlevered_irr: number;
    moic: number;
    yield_on_cost: number;
  };
}