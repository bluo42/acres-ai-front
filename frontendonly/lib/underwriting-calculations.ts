import { UnderwritingInput, CashFlowProjection, UnderwritingResult } from './types'

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

export function calculateUnderwriting(
  input: UnderwritingInput,
  propertyData: any
): UnderwritingResult {
  // Use provided acquisition price or default from property data
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
  }

  // Calculate total construction cost
  const totalConstructionCost = input.units.reduce((sum, unit) => sum + unit.construction_cost, 0)

  // Calculate base rent for existing house (from property data if available)
  const baseRent = propertyData.base_rent || 6710 // Default if not in data

  // Calculate total ADU rent
  const totalAduRent = input.units.reduce((sum, unit) => sum + unit.rent, 0)
  const baseRentAdu = totalAduRent

  // Total equity investment
  const totalEquityIn = totalConstructionCost + acquisitionPrice * (1 + defaults.acquisition_cost_pct)

  // Initialize projections
  const projections: CashFlowProjection[] = []

  for (let year = 0; year <= 5; year++) {
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
      projections.push(projection)
      continue
    }

    // Calculate base rent for house
    if (year > defaults.year_complete_construction) {
      projection.base_rent_house = 12 * baseRent * Math.pow(1 + defaults.base_rent_growth_rate, year)
    } else {
      projection.base_rent_house = 12 * baseRent * Math.pow(1 + defaults.base_rent_growth_rate, year) * 0.5
    }

    // Calculate ADU rent
    if (year + 1 > defaults.year_complete_construction) {
      projection.base_rent_adu = 12 * baseRentAdu * Math.pow(1 + defaults.base_rent_growth_rate, year)
    } else {
      projection.base_rent_adu = 0
    }

    // Calculate other metrics
    projection.general_vacancy = defaults.general_vacancy_pct * projection.base_rent_house
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

    projections.push(projection)
  }

  // Calculate metrics
  const cashFlows = projections.map(proj => proj.total_cash_flow_to_equity)
  const initialInvestment = projections[0].initial_equity_investment

  // Adjust cash flows for IRR calculation
  const irrCashFlows = [...cashFlows]
  irrCashFlows[0] = -initialInvestment + cashFlows[0]

  const unleveredIrr = calculateIRR(irrCashFlows)
  const totalReturnsToEquity = cashFlows.reduce((sum, cf) => sum + cf, 0)
  const moic = initialInvestment > 0 ? totalReturnsToEquity / initialInvestment : 0
  const finalNoi = projections[projections.length - 1].noi
  const yieldOnCost = initialInvestment > 0 ? finalNoi / initialInvestment : 0

  const metrics = {
    initial_equity_investment: initialInvestment,
    total_returns_to_equity: totalReturnsToEquity,
    unlevered_irr: unleveredIrr,
    moic,
    yield_on_cost: yieldOnCost
  }

  return { projections, metrics }
}