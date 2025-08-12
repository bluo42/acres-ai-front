import { supabase } from './supabase'

export interface ZipData {
  zip: string
  date: string
  name: string
  state: string
  avg_rent_price: number
  avg_home_price: number
  avg_rent_home_ratio: number
}

export interface CityData {
  city: string
  date: string
  state: string
  avg_rent_price: number
  avg_home_price: number
  avg_rent_home_ratio: number
}

export const macroService = {
  async getLatestZipData(): Promise<ZipData[]> {
    try {
      const { data, error } = await supabase
        .from('zip_data')
        .select('*')
        .eq('state', 'CA')
        .order('date', { ascending: false })
      
      if (error) throw error
      
      // Group by zip and get latest for each
      const latestByZip = new Map<string, ZipData>()
      data?.forEach((row: any) => {
        if (!latestByZip.has(row.zip)) {
          latestByZip.set(row.zip, {
            zip: row.zip,
            date: row.date,
            name: row.Name || row.name || '',
            state: row.state || 'CA',
            avg_rent_price: parseFloat(row.avg_rent_price) || 0,
            avg_home_price: parseFloat(row.avg_home_price) || 0,
            avg_rent_home_ratio: parseFloat(row.avg_rent_home_ratio) || 0
          })
        }
      })
      
      return Array.from(latestByZip.values())
    } catch (error) {
      console.error('Error fetching zip data:', error)
      return []
    }
  },

  async getZipHistoricalData(zip: string): Promise<ZipData[]> {
    try {
      const { data, error } = await supabase
        .from('zip_data')
        .select('*')
        .eq('zip', zip)
        .order('date', { ascending: true })
      
      if (error) throw error
      
      return data?.map((row: any) => ({
        zip: row.zip,
        date: row.date,
        name: row.Name || row.name || '',
        state: row.state || 'CA',
        avg_rent_price: parseFloat(row.avg_rent_price) || 0,
        avg_home_price: parseFloat(row.avg_home_price) || 0,
        avg_rent_home_ratio: parseFloat(row.avg_rent_home_ratio) || 0
      })) || []
    } catch (error) {
      console.error('Error fetching historical zip data:', error)
      return []
    }
  },

  async getLatestCityData(): Promise<CityData[]> {
    try {
      const { data, error } = await supabase
        .from('city_data')
        .select('*')
        .eq('state', 'CA')
        .order('date', { ascending: false })
      
      if (error) throw error
      
      // Group by city and get latest for each
      const latestByCity = new Map<string, CityData>()
      data?.forEach((row: any) => {
        if (!latestByCity.has(row.city)) {
          latestByCity.set(row.city, {
            city: row.city,
            date: row.date,
            state: row.state || 'CA',
            avg_rent_price: parseFloat(row.avg_rent_price) || 0,
            avg_home_price: parseFloat(row.avg_home_price) || 0,
            avg_rent_home_ratio: parseFloat(row.avg_rent_home_ratio) || 0
          })
        }
      })
      
      return Array.from(latestByCity.values())
    } catch (error) {
      console.error('Error fetching city data:', error)
      return []
    }
  },

  async getCityHistoricalData(city: string): Promise<CityData[]> {
    try {
      const { data, error } = await supabase
        .from('city_data')
        .select('*')
        .eq('city', city)
        .order('date', { ascending: true })
      
      if (error) throw error
      
      return data?.map((row: any) => ({
        city: row.city,
        date: row.date,
        state: row.state || 'CA',
        avg_rent_price: parseFloat(row.avg_rent_price) || 0,
        avg_home_price: parseFloat(row.avg_home_price) || 0,
        avg_rent_home_ratio: parseFloat(row.avg_rent_home_ratio) || 0
      })) || []
    } catch (error) {
      console.error('Error fetching historical city data:', error)
      return []
    }
  }
}