'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { propertyService } from '@/lib/property-service'
import { calculateUnderwriting } from '@/lib/underwriting-calculations'
import { UnitInput, UnderwritingInput, UnderwritingResult } from '@/lib/types'
import { ArrowLeft, Plus, Trash2, Calculator, TrendingUp } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function UnderwritingPage() {
  const params = useParams()
  const propertyIdString = params.id as string
  const propertyId = isNaN(Number(propertyIdString)) ? propertyIdString : parseInt(propertyIdString)
  
  console.log('URL param id:', params.id, 'propertyId:', propertyId, 'type:', typeof propertyId)
  
  const [units, setUnits] = useState<UnitInput[]>([
    { beds: 1, baths: 1, sqft: 600, rent: 2000, construction_cost: 120000 }
  ])
  const [additionalUnits, setAdditionalUnits] = useState(1)
  const [result, setResult] = useState<UnderwritingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  
  const [advancedSettings, setAdvancedSettings] = useState({
    acquisition_price: undefined as number | undefined,
    cap_rate_at_sale: 0.0525,
    selling_cost: 0.065,
    aum_fee: 0.02,
    expense_ratio: 0.28,
    general_vacancy_pct: 0.03,
    year_complete_construction: 1.5,
    base_rent_growth_rate: 0.03,
    year_of_sale: 5,
  })

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: propertyService.getProperties,
  })

  const { data: propertyData } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getPropertyById(propertyId),
    enabled: !!propertyId,
  })

  const property = properties?.find(p => p.id === propertyId)
  
  console.log('Available properties:', properties?.map(p => ({id: p.id, property: p.property})))
  console.log('Looking for property with id:', propertyId)
  console.log('Found property:', property)

  const addUnit = () => {
    setUnits([...units, { beds: 1, baths: 1, sqft: 600, rent: 2000, construction_cost: 120000 }])
    setAdditionalUnits(additionalUnits + 1)
  }

  const removeUnit = (index: number) => {
    if (units.length > 1) {
      setUnits(units.filter((_, i) => i !== index))
      setAdditionalUnits(Math.max(1, additionalUnits - 1))
    }
  }

  const updateUnit = (index: number, field: keyof UnitInput, value: number) => {
    const updatedUnits = [...units]
    updatedUnits[index] = { ...updatedUnits[index], [field]: value }
    setUnits(updatedUnits)
  }

  const handleAnalyze = async () => {
    if (!property || !propertyData) return

    setIsCalculating(true)
    try {
      const input: UnderwritingInput = {
        property_id: property.id,
        additional_units: additionalUnits,
        units,
        ...advancedSettings,
      }

      const calculationResult = calculateUnderwriting(input, propertyData)
      setResult(calculationResult)
    } catch (error) {
      console.error('Error calculating underwriting:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(2) + '%'
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Property not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The property you're looking for doesn't exist.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Properties
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Underwriting Analysis</h1>
            <p className="mt-2 text-gray-600">{property.property}</p>
            <div className="mt-2 text-sm text-gray-500">
              Current: {property.current_units} units
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input Form */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Purchase Price:</span>
                    <div className="font-medium">{formatCurrency(property.price)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Lot Size:</span>
                    <div className="font-medium">{property.lot_size.toLocaleString()} sq ft</div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Additional Units</h2>
                  <button
                    onClick={addUnit}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Unit
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Additional Units
                  </label>
                  <input
                    type="number"
                    value={additionalUnits}
                    onChange={(e) => setAdditionalUnits(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="space-y-4">
                  {units.map((unit, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">Unit {index + 1}</h3>
                        {units.length > 1 && (
                          <button
                            onClick={() => removeUnit(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <label className="block text-gray-700 mb-1">Sq Ft</label>
                          <input
                            type="number"
                            value={unit.sqft}
                            onChange={(e) => updateUnit(index, 'sqft', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Monthly Rent</label>
                          <input
                            type="number"
                            value={unit.rent}
                            onChange={(e) => updateUnit(index, 'rent', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-700 mb-1">Construction Cost</label>
                          <input
                            type="number"
                            value={unit.construction_cost}
                            onChange={(e) => updateUnit(index, 'construction_cost', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-gray-700 mb-1">Cap Rate at Sale</label>
                    <input
                      type="number"
                      step="0.001"
                      value={advancedSettings.cap_rate_at_sale}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        cap_rate_at_sale: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Selling Cost %</label>
                    <input
                      type="number"
                      step="0.001"
                      value={advancedSettings.selling_cost}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        selling_cost: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">AUM Fee %</label>
                    <input
                      type="number"
                      step="0.001"
                      value={advancedSettings.aum_fee}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        aum_fee: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Expense Ratio %</label>
                    <input
                      type="number"
                      step="0.001"
                      value={advancedSettings.expense_ratio}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        expense_ratio: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Vacancy %</label>
                    <input
                      type="number"
                      step="0.001"
                      value={advancedSettings.general_vacancy_pct}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        general_vacancy_pct: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Rent Growth %</label>
                    <input
                      type="number"
                      step="0.001"
                      value={advancedSettings.base_rent_growth_rate}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        base_rent_growth_rate: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Construction Complete (Years)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={advancedSettings.year_complete_construction}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        year_complete_construction: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Year of Sale</label>
                    <input
                      type="number"
                      value={advancedSettings.year_of_sale}
                      onChange={(e) => setAdvancedSettings({
                        ...advancedSettings,
                        year_of_sale: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isCalculating || !propertyData}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Calculator className="h-5 w-5 mr-2" />
                )}
                {isCalculating ? 'Analyzing...' : 'Analyze Investment'}
              </button>

              {/* AI Lot Analysis - Bottom Left */}
              {propertyData?.lot_analysis && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">AI Lot Analysis</h3>
                      <div className="mt-2 text-sm text-blue-700 whitespace-pre-wrap">
                        {propertyData.lot_analysis}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {result && (
                <>
                  {/* Key Metrics */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <h2 className="text-lg font-medium text-gray-900">Investment Metrics</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Initial Equity Investment</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(result.metrics.initial_equity_investment)}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Total Returns to Equity</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(result.metrics.total_returns_to_equity)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-sm text-blue-600">Unlevered IRR</div>
                          <div className="text-lg font-bold text-blue-700">
                            {formatPercentage(result.metrics.unlevered_irr)}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-sm text-purple-600">MOIC</div>
                          <div className="text-lg font-bold text-purple-700">
                            {result.metrics.moic.toFixed(2)}x
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600">Yield on Cost</div>
                        <div className="text-lg font-bold text-green-700">
                          {formatPercentage(result.metrics.yield_on_cost)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Flow Projections */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">5-Year Cash Flow Projections</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              NOI
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cash Flow
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Property Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.projections.map((projection) => (
                            <tr key={projection.year} className={projection.year === 0 ? 'bg-blue-50' : ''}>
                              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {projection.year}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {projection.year === 0 ? '-' : formatCurrency(projection.noi)}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {projection.year === 0 
                                  ? `-${formatCurrency(projection.initial_equity_investment)}`
                                  : formatCurrency(projection.total_cash_flow_to_equity)
                                }
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {projection.year === 0 ? '-' : formatCurrency(projection.property_value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {!result && (
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Configure your investment parameters and click "Analyze Investment" to see projections.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}