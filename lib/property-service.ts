import { supabase } from './supabase'
import { PropertySummary } from './types'

export const propertyService = {
  async getProperties(): Promise<PropertySummary[]> {
    try {
      console.log('Attempting to fetch properties from all_data_with_analysis...')
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('all_data_with_analysis')
        .select('count', { count: 'exact', head: true })

      console.log('Connection test:', { testData, testError })

      if (testError) {
        console.error('Supabase connection error:', testError)
        // Return mock data for development
        return [
          {
            id: 1,
            property: "123 Main St, San Francisco, CA 94102",
            price: 850000,
            current_units: 1,
            current_beds: 2,
            current_baths: 1,
            lot_size: 1200,
            additional_units: 0,
            total_units: 1
          },
          {
            id: 2,
            property: "456 Oak Ave, Oakland, CA 94601",
            price: 650000,
            current_units: 1,
            current_beds: 3,
            current_baths: 2,
            lot_size: 1500,
            additional_units: 1,
            total_units: 2
          }
        ]
      }

      const { data, error } = await supabase
        .from('all_data_with_analysis')
        .select('*')

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        console.log('No data returned from Supabase')
        return []
      }

      console.log('Sample row structure:', Object.keys(data[0]))

      const properties: PropertySummary[] = data.map((row: any) => {
        console.log('Processing row:', row)

        // Extract additional_units (expecting a number)
        let additional_units = 0
        if (row.additional_units) {
          try {
            additional_units = parseFloat(row.additional_units) || 0
          } catch {
            additional_units = 0
          }
        }

        // Calculate total units by summing up all unit type columns
        let total_units = 0
        for (let i = 1; i <= 10; i++) {
          const unitCount = row[`unit_type_${i}_num_units`]
          if (unitCount != null) {
            try {
              total_units += parseFloat(unitCount) || 0
            } catch {
              // Skip if not a valid number
            }
          }
        }

        // Be flexible with column names - try different variations
        const id = row.MLS_ID || row.id || row.mls_id || row.ID || ""
        const address = row.address || row.Address || ''
        const city = row.city || row.City || ''
        const state = row.state || row.State || ''
        const zipCode = row.zip_code || row.zip || row.Zip || ''
        const price = row.price || row.Price || 0
        const beds = row.beds || row.Beds || row.current_beds || 0
        const baths = row.baths || row.Baths || row.current_baths || 0
        const lotSize = row.lot_size || row.LotSize || row.lot_Size || 0

        return {
          id,
          property: `${address}, ${city}, ${state} ${zipCode}`,
          price,
          current_units: beds, // Using beds as current units proxy
          current_beds: beds,
          current_baths: baths,
          lot_size: lotSize,
          additional_units,
          total_units
        }
      })

      return properties
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  async getPropertyById(id: string | number) {
    try {
      console.log('Fetching property by ID:', id)
      
      const { data, error } = await supabase
        .from('all_data_with_analysis')
        .select('*')
        .eq('MLS_ID', id)
        .single()

      console.log('Property fetch result:', { data, error })

      if (error) {
        console.error('Error fetching property by ID:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching property:', error)
      throw error
    }
  }
}