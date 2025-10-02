import { UnderwritingInput, UnitInput, CashFlowProjection, UnderwritingResult } from './types'

interface MonthlyProjection {
  month: number
  year: number
  base_rent_house: number
  base_rent_units: number[]
  total_rent: number
  vacancy: number
  effective_gross_income: number
  expenses: number
  noi: number
  debt_service: number
  cash_flow: number
  construction_in_progress: number[]
  units_online: boolean[]
}

interface EnhancedUnderwritingResult extends UnderwritingResult {
  monthlyProjections?: MonthlyProjection[]
  yearlyProjections: CashFlowProjection[]
  developmentSchedule: {
    unit: number
    description: string
    startMonth: number
    completionMonth: number
    cost: number
    monthlyRent: number
  }[]
}

function calculateIRR(cashFlows: number[], maxIter = 1000, precision = 1e-6): number {
  let rate = 0.1 // Initial guess

  for (let i = 0; i < maxIter; i++) {
    const npv = cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0)
    const npvDerivative = cashFlows.reduce((sum, cf, t) => sum + (-t * cf) / Math.pow(1 + rate, t + 1), 0)

    if (Math.abs(npv) < precision) {
      return rate
    }

    if (npvDerivative === 0) {
      break
    }

    rate = rate - npv / npvDerivative

    if (rate < -1) {
      rate = -0.99
    }
  }

  return rate
}

export function calculateEnhancedUnderwriting(
  input: UnderwritingInput & { underwriting_period?: 'monthly' | 'yearly' },
  propertyData: any
): EnhancedUnderwritingResult {
  const acquisitionPrice = input.acquisition_price || propertyData.price
  
  // Set default values
  const defaults = {
    down_payment: input.down_payment || 1.0,
    acquisition_cost_pct: input.acquisition_cost_pct || 0.04,
    cap_rate_at_sale: input.cap_rate_at_sale || 0.0525,
    selling_cost: input.selling_cost || 0.065,
    aum_fee: input.aum_fee || 0.02,
    expense_ratio: input.expense_ratio || 0.28,
    general_vacancy_pct: input.general_vacancy_pct || 0.03,
    year_complete_construction: input.year_complete_construction || 1.5,
    base_rent_growth_rate: input.base_rent_growth_rate || 0.03,
    year_of_sale: input.year_of_sale || 5,
    underwriting_period: input.underwriting_period || 'yearly'
  }

  // Create development schedule
  const developmentSchedule = input.units.map((unit, index) => ({
    unit: index + 1,
    description: `${unit.beds}BR/${unit.baths}BA - ${unit.sqft} sqft (${unit.unit_type || 'new'})`,
    startMonth: unit.start_month || 1,
    completionMonth: (unit.start_month || 1) + (unit.time_to_completion || 6),
    cost: unit.construction_cost,
    monthlyRent: unit.rent
  }))

  // Calculate total construction cost
  const totalConstructionCost = input.units.reduce((sum, unit) => sum + unit.construction_cost, 0)
  
  // Calculate base rent for existing house
  const baseRentHouse = propertyData.base_rent || 6710
  
  // Total equity investment
  const totalEquityIn = totalConstructionCost + acquisitionPrice * (1 + defaults.acquisition_cost_pct)
  
  // Generate monthly projections if requested
  let monthlyProjections: MonthlyProjection[] = []
  
  if (defaults.underwriting_period === 'monthly') {
    const totalMonths = defaults.year_of_sale * 12
    
    for (let month = 0; month <= totalMonths; month++) {
      const yearNum = Math.floor(month / 12)
      const monthNum = month % 12
      
      const projection: MonthlyProjection = {
        month: monthNum + 1,
        year: yearNum,
        base_rent_house: 0,
        base_rent_units: [],
        total_rent: 0,
        vacancy: 0,
        effective_gross_income: 0,
        expenses: 0,
        noi: 0,
        debt_service: 0,
        cash_flow: 0,
        construction_in_progress: [],
        units_online: []
      }
      
      // Calculate house rent
      if (month > 0) {
        const rentGrowthFactor = Math.pow(1 + defaults.base_rent_growth_rate / 12, month)
        projection.base_rent_house = baseRentHouse * rentGrowthFactor
      }
      
      // Calculate rent for each unit
      input.units.forEach((unit, index) => {
        const unitCompletionMonth = (unit.start_month || 1) + (unit.time_to_completion || 6)
        const isComplete = month >= unitCompletionMonth
        const isInProgress = month >= (unit.start_month || 1) && month < unitCompletionMonth
        
        projection.units_online.push(isComplete)
        projection.construction_in_progress.push(isInProgress ? unit.construction_cost / (unit.time_to_completion || 6) : 0)
        
        if (isComplete) {
          const monthsSinceCompletion = month - unitCompletionMonth
          const rentGrowthFactor = Math.pow(1 + defaults.base_rent_growth_rate / 12, monthsSinceCompletion)
          projection.base_rent_units.push(unit.rent * rentGrowthFactor)
        } else {
          projection.base_rent_units.push(0)
        }
      })
      
      // Calculate totals
      projection.total_rent = projection.base_rent_house + projection.base_rent_units.reduce((sum, rent) => sum + rent, 0)
      projection.vacancy = projection.total_rent * defaults.general_vacancy_pct
      projection.effective_gross_income = projection.total_rent - projection.vacancy
      projection.expenses = projection.effective_gross_income * defaults.expense_ratio
      projection.noi = projection.effective_gross_income - projection.expenses
      
      // Simplified debt service calculation (if LTV > 0)
      projection.debt_service = 0 // Can be enhanced with actual loan calculations
      
      projection.cash_flow = projection.noi - projection.debt_service - 
        projection.construction_in_progress.reduce((sum, cost) => sum + cost, 0)
      
      monthlyProjections.push(projection)
    }
  }
  
  // Generate yearly projections
  const yearlyProjections: CashFlowProjection[] = []
  
  for (let year = 0; year <= defaults.year_of_sale; year++) {
    const projection: CashFlowProjection = {
      year,
      base_rent_house: 0,
      base_rent_adu: 0,
      general_vacancy: 0,
      effective_gross_income: 0,
      expenses: 0,
      noi: 0,
      property_value: 0,
      aum_fee: 0,
      cash_flow_from_operations: 0,
      proceeds_from_sale_of_property: 0,
      selling_costs: 0,
      initial_equity_investment: 0,
      total_cash_flow_to_equity: 0
    }
    
    if (year === 0) {
      projection.initial_equity_investment = totalEquityIn
      yearlyProjections.push(projection)
      continue
    }
    
    // Calculate base rent for house
    const rentGrowthFactor = Math.pow(1 + defaults.base_rent_growth_rate, year)
    projection.base_rent_house = 12 * baseRentHouse * rentGrowthFactor
    
    // Calculate rent for all units
    let totalUnitRent = 0
    input.units.forEach((unit) => {
      const completionYear = ((unit.start_month || 1) + (unit.time_to_completion || 6)) / 12
      if (year >= completionYear) {
        const yearsSinceCompletion = year - completionYear
        const unitRentGrowthFactor = Math.pow(1 + defaults.base_rent_growth_rate, yearsSinceCompletion)
        totalUnitRent += 12 * unit.rent * unitRentGrowthFactor
      }
    })
    projection.base_rent_adu = totalUnitRent
    
    // Calculate other metrics
    projection.general_vacancy = (projection.base_rent_house + projection.base_rent_adu) * defaults.general_vacancy_pct
    projection.effective_gross_income = projection.base_rent_house + projection.base_rent_adu - projection.general_vacancy
    projection.expenses = projection.effective_gross_income * defaults.expense_ratio
    projection.noi = projection.effective_gross_income - projection.expenses
    projection.property_value = projection.noi / defaults.cap_rate_at_sale
    projection.aum_fee = totalEquityIn * defaults.aum_fee
    projection.cash_flow_from_operations = projection.noi - projection.aum_fee
    
    // Sale calculations
    if (year === defaults.year_of_sale) {
      projection.proceeds_from_sale_of_property = projection.property_value
      projection.selling_costs = projection.property_value * defaults.selling_cost
    }
    
    projection.total_cash_flow_to_equity = 
      projection.cash_flow_from_operations + 
      projection.proceeds_from_sale_of_property - 
      projection.selling_costs
    
    yearlyProjections.push(projection)
  }
  
  // Calculate metrics
  const cashFlows = yearlyProjections.map(proj => proj.total_cash_flow_to_equity)
  const initialInvestment = yearlyProjections[0].initial_equity_investment
  
  // Adjust cash flows for IRR calculation
  const irrCashFlows = [...cashFlows]
  irrCashFlows[0] = -initialInvestment + cashFlows[0]
  
  const unleveredIrr = calculateIRR(irrCashFlows)
  const totalReturnsToEquity = cashFlows.reduce((sum, cf) => sum + cf, 0)
  const moic = initialInvestment > 0 ? totalReturnsToEquity / initialInvestment : 0
  const finalNoi = yearlyProjections[yearlyProjections.length - 1].noi
  const yieldOnCost = initialInvestment > 0 ? finalNoi / initialInvestment : 0
  
  const metrics = {
    initial_equity_investment: initialInvestment,
    total_returns_to_equity: totalReturnsToEquity,
    unlevered_irr: unleveredIrr,
    moic,
    yield_on_cost: yieldOnCost
  }
  
  return {
    projections: yearlyProjections,
    yearlyProjections,
    monthlyProjections: defaults.underwriting_period === 'monthly' ? monthlyProjections : undefined,
    developmentSchedule,
    metrics
  }
}