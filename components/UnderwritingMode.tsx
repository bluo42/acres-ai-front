'use client'

import { useState, useEffect } from 'react'
import { UnitInput } from '@/lib/types'
import { 
  Plus, 
  Trash2, 
  Calculator, 
  TrendingUp, 
  Home,
  Hammer,
  DollarSign,
  Calendar,
  Square,
  Bed,
  Bath,
  MapPin,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react'

interface UnderwritingModeProps {
  propertyData?: any
  onCalculate: (units: UnitInput[], settings: UnderwritingSettings) => void
}

interface UnderwritingSettings {
  acquisition_price?: number
  cap_rate_at_sale: number
  selling_cost: number
  aum_fee: number
  expense_ratio: number
  general_vacancy_pct: number
  year_complete_construction: number
  base_rent_growth_rate: number
  year_of_sale: number
  underwriting_period: 'monthly' | 'yearly'
  construction_loan_rate?: number
  permanent_loan_rate?: number
  ltv_ratio?: number
}

interface RentData {
  [zipCode: string]: {
    studio: number
    oneBed: number
    twoBed: number
    threeBed: number
    fourBed: number
  }
}

// Sample rent data by zip code (in production, this would come from a database)
const RENT_DATA: RentData = {
  '90210': { studio: 2800, oneBed: 3500, twoBed: 4800, threeBed: 6500, fourBed: 8000 },
  '10001': { studio: 3200, oneBed: 4000, twoBed: 5500, threeBed: 7200, fourBed: 9000 },
  '94102': { studio: 3000, oneBed: 3800, twoBed: 5200, threeBed: 6800, fourBed: 8500 },
  '60601': { studio: 2200, oneBed: 2800, twoBed: 3800, threeBed: 5000, fourBed: 6500 },
  '78701': { studio: 1800, oneBed: 2400, twoBed: 3200, threeBed: 4200, fourBed: 5500 },
  '98101': { studio: 2400, oneBed: 3000, twoBed: 4000, threeBed: 5500, fourBed: 7000 },
  '33139': { studio: 2600, oneBed: 3300, twoBed: 4500, threeBed: 6000, fourBed: 7500 },
  '85001': { studio: 1400, oneBed: 1800, twoBed: 2400, threeBed: 3200, fourBed: 4000 },
  '80202': { studio: 1900, oneBed: 2500, twoBed: 3400, threeBed: 4500, fourBed: 5800 },
  '02108': { studio: 2700, oneBed: 3400, twoBed: 4600, threeBed: 6200, fourBed: 7800 }
}

// Preset scenarios
const PRESETS = {
  renovation: {
    name: 'Renovate Existing Unit',
    units: [{
      beds: 2,
      baths: 2,
      sqft: 1200,
      rent: 2800,
      construction_cost: 60000,
      time_to_completion: 3,
      start_month: 1,
      cost_per_sf: 50,
      unit_type: 'renovation' as const,
      auto_rent: true
    }]
  },
  newStudio: {
    name: 'Add Studio ADU',
    units: [{
      beds: 0,
      baths: 1,
      sqft: 400,
      rent: 1800,
      construction_cost: 120000,
      time_to_completion: 6,
      start_month: 2,
      cost_per_sf: 300,
      unit_type: 'new' as const,
      auto_rent: true
    }]
  },
  new1Bed: {
    name: 'Add 1-Bedroom ADU',
    units: [{
      beds: 1,
      baths: 1,
      sqft: 600,
      rent: 2400,
      construction_cost: 180000,
      time_to_completion: 8,
      start_month: 2,
      cost_per_sf: 300,
      unit_type: 'new' as const,
      auto_rent: true
    }]
  },
  new2Bed: {
    name: 'Add 2-Bedroom ADU',
    units: [{
      beds: 2,
      baths: 2,
      sqft: 800,
      rent: 3200,
      construction_cost: 240000,
      time_to_completion: 10,
      start_month: 3,
      cost_per_sf: 300,
      unit_type: 'new' as const,
      auto_rent: true
    }]
  },
  multiUnit: {
    name: 'Multi-Unit Development',
    units: [
      {
        beds: 1,
        baths: 1,
        sqft: 600,
        rent: 2400,
        construction_cost: 180000,
        time_to_completion: 10,
        start_month: 2,
        cost_per_sf: 300,
        unit_type: 'new' as const,
        auto_rent: true
      },
      {
        beds: 2,
        baths: 2,
        sqft: 800,
        rent: 3200,
        construction_cost: 240000,
        time_to_completion: 10,
        start_month: 2,
        cost_per_sf: 300,
        unit_type: 'new' as const,
        auto_rent: true
      }
    ]
  }
}

export default function UnderwritingMode({ propertyData, onCalculate }: UnderwritingModeProps) {
  const [units, setUnits] = useState<UnitInput[]>([])
  const [zipCode, setZipCode] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [settings, setSettings] = useState<UnderwritingSettings>({
    cap_rate_at_sale: 0.0525,
    selling_cost: 0.065,
    aum_fee: 0.02,
    expense_ratio: 0.28,
    general_vacancy_pct: 0.03,
    year_complete_construction: 1.5,
    base_rent_growth_rate: 0.03,
    year_of_sale: 5,
    underwriting_period: 'yearly',
    construction_loan_rate: 0.065,
    permanent_loan_rate: 0.055,
    ltv_ratio: 0.75
  })

  // Initialize with a default unit
  useEffect(() => {
    if (units.length === 0) {
      setUnits([{
        beds: 1,
        baths: 1,
        sqft: 600,
        rent: 2000,
        construction_cost: 180000,
        time_to_completion: 6,
        start_month: 1,
        cost_per_sf: 300,
        unit_type: 'new',
        auto_rent: false
      }])
    }
  }, [])

  const addUnit = () => {
    setUnits([...units, {
      beds: 1,
      baths: 1,
      sqft: 600,
      rent: 2000,
      construction_cost: 180000,
      time_to_completion: 6,
      start_month: 1,
      cost_per_sf: 300,
      unit_type: 'new',
      auto_rent: false
    }])
  }

  const removeUnit = (index: number) => {
    if (units.length > 1) {
      setUnits(units.filter((_, i) => i !== index))
    }
  }

  const updateUnit = (index: number, field: keyof UnitInput, value: any) => {
    const updatedUnits = [...units]
    updatedUnits[index] = { ...updatedUnits[index], [field]: value }
    
    // Auto-calculate construction cost if cost_per_sf changes
    if (field === 'cost_per_sf' || field === 'sqft') {
      const sqft = field === 'sqft' ? Number(value) : updatedUnits[index].sqft
      const costPerSf = field === 'cost_per_sf' ? Number(value) : updatedUnits[index].cost_per_sf || 300
      updatedUnits[index].construction_cost = sqft * costPerSf
    }
    
    // Auto-lookup rent if enabled and zip code is available
    if (updatedUnits[index].auto_rent && zipCode && RENT_DATA[zipCode]) {
      const rentData = RENT_DATA[zipCode]
      const beds = updatedUnits[index].beds
      const rent = beds === 0 ? rentData.studio :
                   beds === 1 ? rentData.oneBed :
                   beds === 2 ? rentData.twoBed :
                   beds === 3 ? rentData.threeBed :
                   rentData.fourBed
      updatedUnits[index].rent = rent
    }
    
    setUnits(updatedUnits)
  }

  const lookupRent = (index: number) => {
    if (zipCode && RENT_DATA[zipCode]) {
      const rentData = RENT_DATA[zipCode]
      const beds = units[index].beds
      const rent = beds === 0 ? rentData.studio :
                   beds === 1 ? rentData.oneBed :
                   beds === 2 ? rentData.twoBed :
                   beds === 3 ? rentData.threeBed :
                   rentData.fourBed
      updateUnit(index, 'rent', rent)
    }
  }

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey]
    setUnits(preset.units.map(unit => ({ ...unit })))
  }

  const handleCalculate = () => {
    onCalculate(units, settings)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Start Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                {key === 'renovation' ? <Hammer className="h-5 w-5 text-gray-600" /> : 
                 key === 'multiUnit' ? <Zap className="h-5 w-5 text-gray-600" /> :
                 <Home className="h-5 w-5 text-gray-600" />}
              </div>
              <div className="text-sm font-medium text-gray-900">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Zip Code for Rent Lookup */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Location</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code (for rent estimates)
            </label>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="e.g., 90210"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">
                {RENT_DATA[zipCode] ? '✓ Rent data available' : 'Enter zip for rent lookup'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Development Units</h3>
          <button
            onClick={addUnit}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Unit
          </button>
        </div>

        <div className="space-y-4">
          {units.map((unit, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Unit {index + 1} ({unit.unit_type === 'renovation' ? 'Renovation' : 'New Construction'})
                </h4>
                <div className="flex items-center space-x-2">
                  <select
                    value={unit.unit_type || 'new'}
                    onChange={(e) => updateUnit(index, 'unit_type', e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md"
                  >
                    <option value="new">New Construction</option>
                    <option value="renovation">Renovation</option>
                  </select>
                  {units.length > 1 && (
                    <button
                      onClick={() => removeUnit(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Bed className="inline h-4 w-4 mr-1" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={unit.beds}
                    onChange={(e) => updateUnit(index, 'beds', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Bath className="inline h-4 w-4 mr-1" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={unit.baths}
                    onChange={(e) => updateUnit(index, 'baths', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="4"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Square className="inline h-4 w-4 mr-1" />
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={unit.sqft}
                    onChange={(e) => updateUnit(index, 'sqft', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="200"
                    step="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Cost/SF
                  </label>
                  <input
                    type="number"
                    value={unit.cost_per_sf || 300}
                    onChange={(e) => updateUnit(index, 'cost_per_sf', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="50"
                    step="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Start Month
                  </label>
                  <input
                    type="number"
                    value={unit.start_month || 1}
                    onChange={(e) => updateUnit(index, 'start_month', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Time to Complete (months)
                  </label>
                  <input
                    type="number"
                    value={unit.time_to_completion || 6}
                    onChange={(e) => updateUnit(index, 'time_to_completion', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="36"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Monthly Rent
                  </label>
                  <div className="flex space-x-1">
                    <input
                      type="number"
                      value={unit.rent}
                      onChange={(e) => updateUnit(index, 'rent', Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="500"
                      step="100"
                    />
                    {zipCode && RENT_DATA[zipCode] && (
                      <button
                        onClick={() => lookupRent(index)}
                        className="px-2 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        title="Auto-fill rent based on zip code"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Total Cost
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {formatCurrency(unit.construction_cost)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id={`auto-rent-${index}`}
                  checked={unit.auto_rent || false}
                  onChange={(e) => updateUnit(index, 'auto_rent', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`auto-rent-${index}`} className="ml-2 text-sm text-gray-700">
                  Auto-update rent when zip code or bedrooms change
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-medium text-gray-900">
            <Settings className="inline h-5 w-5 mr-2" />
            Advanced Settings & Assumptions
          </h3>
          {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Underwriting Period
                </label>
                <select
                  value={settings.underwriting_period}
                  onChange={(e) => setSettings({ ...settings, underwriting_period: e.target.value as 'monthly' | 'yearly' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acquisition Price
                </label>
                <input
                  type="number"
                  value={settings.acquisition_price || ''}
                  onChange={(e) => setSettings({ ...settings, acquisition_price: Number(e.target.value) || undefined })}
                  placeholder="Auto from property"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cap Rate at Sale (%)
                </label>
                <input
                  type="number"
                  value={(settings.cap_rate_at_sale * 100).toFixed(2)}
                  onChange={(e) => setSettings({ ...settings, cap_rate_at_sale: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Ratio (%)
                </label>
                <input
                  type="number"
                  value={(settings.expense_ratio * 100).toFixed(0)}
                  onChange={(e) => setSettings({ ...settings, expense_ratio: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vacancy Rate (%)
                </label>
                <input
                  type="number"
                  value={(settings.general_vacancy_pct * 100).toFixed(0)}
                  onChange={(e) => setSettings({ ...settings, general_vacancy_pct: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent Growth Rate (%)
                </label>
                <input
                  type="number"
                  value={(settings.base_rent_growth_rate * 100).toFixed(0)}
                  onChange={(e) => setSettings({ ...settings, base_rent_growth_rate: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Construction Loan Rate (%)
                </label>
                <input
                  type="number"
                  value={(settings.construction_loan_rate || 0) * 100}
                  onChange={(e) => setSettings({ ...settings, construction_loan_rate: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Loan Rate (%)
                </label>
                <input
                  type="number"
                  value={(settings.permanent_loan_rate || 0) * 100}
                  onChange={(e) => setSettings({ ...settings, permanent_loan_rate: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LTV Ratio (%)
                </label>
                <input
                  type="number"
                  value={(settings.ltv_ratio || 0) * 100}
                  onChange={(e) => setSettings({ ...settings, ltv_ratio: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Cost (%)
                </label>
                <input
                  type="number"
                  value={(settings.selling_cost * 100).toFixed(1)}
                  onChange={(e) => setSettings({ ...settings, selling_cost: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AUM Fee (%)
                </label>
                <input
                  type="number"
                  value={(settings.aum_fee * 100).toFixed(1)}
                  onChange={(e) => setSettings({ ...settings, aum_fee: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of Sale
                </label>
                <input
                  type="number"
                  value={settings.year_of_sale}
                  onChange={(e) => setSettings({ ...settings, year_of_sale: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCalculate}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Calculator className="h-5 w-5 mr-2" />
          Calculate Underwriting
        </button>
      </div>
    </div>
  )
}