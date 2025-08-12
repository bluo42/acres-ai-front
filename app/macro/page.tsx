'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { macroService, ZipData, CityData } from '@/lib/macro-service'
import Navbar from '@/components/navbar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { scaleSequential } from 'd3-scale'
import { interpolateRdBu } from 'd3-scale-chromatic'
import { TrendingUp, TrendingDown, Home, DollarSign, MapPin, Calendar, X } from 'lucide-react'
import zipcodes from 'zipcodes'

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Rectangle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Rectangle),
  { ssr: false }
)

// Function to get coordinates for any zip code
const getZipCoordinates = (zipCode: string): [number, number] | null => {
  try {
    const zipInfo = zipcodes.lookup(zipCode)
    if (zipInfo && zipInfo.latitude && zipInfo.longitude) {
      return [parseFloat(zipInfo.latitude), parseFloat(zipInfo.longitude)]
    }
    return null
  } catch (error) {
    console.warn(`Could not find coordinates for zip code ${zipCode}`)
    return null
  }
}

// City coordinates
const CITY_COORDINATES: Record<string, [number, number]> = {
  'Los Angeles': [34.0522, -118.2437],
  'San Francisco': [37.7749, -122.4194],
  'San Diego': [32.7157, -117.1611],
  'San Jose': [37.3382, -121.8863],
  'Oakland': [37.8044, -122.2712],
  'Sacramento': [38.5816, -121.4944],
  'Long Beach': [33.7701, -118.1937],
  'Fresno': [36.7378, -119.7871],
  'Santa Barbara': [34.4208, -119.6982],
  'Berkeley': [37.8715, -122.2730],
  'Pasadena': [34.1478, -118.1445],
  'Irvine': [33.6846, -117.8265],
  'Santa Monica': [34.0195, -118.4912],
  'Palo Alto': [37.4419, -122.1430],
  'Mountain View': [37.3861, -122.0839],
  'Cupertino': [37.3230, -122.0322],
  // Add more cities as needed
}

export default function MacroPage() {
  const [viewMode, setViewMode] = useState<'zip' | 'city'>('zip')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)

  // Fetch data
  const { data: zipData, isLoading: zipLoading } = useQuery({
    queryKey: ['zipData'],
    queryFn: macroService.getLatestZipData,
    enabled: viewMode === 'zip'
  })

  const { data: cityData, isLoading: cityLoading } = useQuery({
    queryKey: ['cityData'],
    queryFn: macroService.getLatestCityData,
    enabled: viewMode === 'city'
  })

  // Get zip code bounds for area shading
  const getZipBounds = (zipCode: string): [[number, number], [number, number]] | null => {
    const coords = getZipCoordinates(zipCode)
    if (!coords) return null
    
    // Create a small rectangle around the zip center (approximate zip area)
    const [lat, lng] = coords
    const offset = 0.02 // Adjust this for larger/smaller areas
    return [
      [lat - offset, lng - offset], // southwest
      [lat + offset, lng + offset]  // northeast
    ]
  }

  const handleMarkerClick = async (item: string, type: 'zip' | 'city') => {
    setSelectedItem(item)
    setShowModal(true)
    
    let data: any[] = []
    if (type === 'zip') {
      data = await macroService.getZipHistoricalData(item)
    } else {
      data = await macroService.getCityHistoricalData(item)
    }
    
    // Format data for chart
    const chartData = data.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { year: '2-digit', month: 'short' }),
      'Avg Rent': d.avg_rent_price,
      'Avg Home Price': d.avg_home_price / 1000, // Convert to thousands
      'Rent/Home Ratio': (d.avg_rent_home_ratio * 100).toFixed(3) // Convert to percentage
    }))
    
    setHistoricalData(chartData)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatRatio = (ratio: number) => {
    return (ratio * 100).toFixed(3) + '%'
  }

  const currentData = viewMode === 'zip' ? zipData : cityData
  const isLoading = viewMode === 'zip' ? zipLoading : cityLoading

  // Dynamic color scale based on actual data distribution (blue = low, red = high)
  const getColorScale = (data: any[]) => {
    if (!data || data.length === 0) return null
    
    const ratios = data.map(d => d.avg_rent_home_ratio).filter(r => r > 0)
    const minRatio = Math.min(...ratios)
    const maxRatio = Math.max(...ratios)
    
    return scaleSequential(interpolateRdBu)
      .domain([maxRatio, minRatio]) // Reversed: blue for low, red for high ratios
  }

  const colorScale = getColorScale(currentData || [])
  
  const getColor = (ratio: number): string => {
    if (ratio === 0 || !colorScale) return '#999999'
    return colorScale(ratio) as string
  }

  // Debug logging
  useEffect(() => {
    if (zipData) {
      console.log(`Loaded ${zipData.length} zip codes:`, zipData.slice(0, 5))
    }
    if (cityData) {
      console.log(`Loaded ${cityData.length} cities:`, cityData.slice(0, 5))
    }
  }, [zipData, cityData])

  // Calculate statistics
  const stats = currentData ? {
    avgRatio: currentData.reduce((sum, d) => sum + d.avg_rent_home_ratio, 0) / currentData.length,
    maxRatio: Math.max(...currentData.map(d => d.avg_rent_home_ratio)),
    minRatio: Math.min(...currentData.map(d => d.avg_rent_home_ratio)),
    avgRent: currentData.reduce((sum, d) => sum + d.avg_rent_price, 0) / currentData.length,
    avgHome: currentData.reduce((sum, d) => sum + d.avg_home_price, 0) / currentData.length,
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header with mode toggle */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">California Market Analysis</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Visualizing rent-to-home price ratios across California
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('zip')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'zip'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Zip Codes
                </button>
                <button
                  onClick={() => setViewMode('city')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'city'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cities
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-xs font-medium">AVG RATIO</p>
                      <p className="text-xl font-bold text-blue-900">{formatRatio(stats.avgRatio)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-xs font-medium">BEST RATIO</p>
                      <p className="text-xl font-bold text-green-900">{formatRatio(stats.maxRatio)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-xs font-medium">WORST RATIO</p>
                      <p className="text-xl font-bold text-red-900">{formatRatio(stats.minRatio)}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-xs font-medium">AVG RENT</p>
                      <p className="text-xl font-bold text-purple-900">{formatCurrency(stats.avgRent)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500 opacity-50" />
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-600 text-xs font-medium">AVG HOME</p>
                      <p className="text-xl font-bold text-indigo-900">{formatCurrency(stats.avgHome)}</p>
                    </div>
                    <Home className="h-8 w-8 text-indigo-500 opacity-50" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Interactive Map</h2>
              <p className="text-sm text-gray-600 mt-1">
                Click on any marker to view historical trends. Color indicates rent-to-home ratio (green = good investment potential).
              </p>
              {currentData && (
                <p className="text-xs text-gray-500 mt-1">
                  Showing {currentData.length} {viewMode === 'zip' ? 'zip codes' : 'cities'} in California
                </p>
              )}
            </div>
            
            {/* Color Legend */}
            <div className="mb-4 flex items-center space-x-4">
              <span className="text-sm text-gray-600">Rent-to-Home Price Ratio:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#053061' }}></div>
                  <span className="ml-1 text-xs text-gray-600">Low</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f7f7f7' }}></div>
                  <span className="ml-1 text-xs text-gray-600">Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#67001f' }}></div>
                  <span className="ml-1 text-xs text-gray-600">High</span>
                </div>
              </div>
              {stats && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>Range: {formatRatio(stats.minRatio)} - {formatRatio(stats.maxRatio)}</span>
                </div>
              )}
            </div>

            <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
              {!isLoading && currentData && (
                <MapContainer
                  center={[37.3382, -119.8863]} // Center of California
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {viewMode === 'zip' && zipData?.map((zip) => {
                    const bounds = getZipBounds(zip.zip)
                    if (!bounds) {
                      console.warn(`No coordinates found for zip ${zip.zip}`)
                      return null
                    }
                    
                    return (
                      <Rectangle
                        key={zip.zip}
                        bounds={bounds}
                        pathOptions={{
                          fillColor: getColor(Number(zip.avg_rent_home_ratio)),
                          fillOpacity: 0.7,
                          color: 'rgba(255,255,255,0.3)',
                          weight: 0.5,
                          opacity: 1,
                        }}
                        eventHandlers={{
                          click: () => handleMarkerClick(zip.zip, 'zip')
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{zip.name || `ZIP ${zip.zip}`}</h3>
                            <div className="text-sm mt-1">
                              <p>Rent: {formatCurrency(zip.avg_rent_price)}</p>
                              <p>Home: {formatCurrency(zip.avg_home_price)}</p>
                              <p className="font-medium">Ratio: {formatRatio(zip.avg_rent_home_ratio)}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Data from: {new Date(zip.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Rectangle>
                    )
                  })}
                  
                  {viewMode === 'city' && cityData?.map((city) => {
                    const coords = CITY_COORDINATES[city.city]
                    if (!coords) return null
                    
                    // Create city bounds (larger than zip codes)
                    const [lat, lng] = coords
                    const offset = 0.05 // Larger area for cities
                    const bounds: [[number, number], [number, number]] = [
                      [lat - offset, lng - offset],
                      [lat + offset, lng + offset]
                    ]
                    
                    return (
                      <Rectangle
                        key={city.city}
                        bounds={bounds}
                        pathOptions={{
                          fillColor: getColor(Number(city.avg_rent_home_ratio)),
                          fillOpacity: 0.7,
                          color: 'rgba(255,255,255,0.4)',
                          weight: 1,
                          opacity: 1,
                        }}
                        eventHandlers={{
                          click: () => handleMarkerClick(city.city, 'city')
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{city.city}</h3>
                            <div className="text-sm mt-1">
                              <p>Rent: {formatCurrency(city.avg_rent_price)}</p>
                              <p>Home: {formatCurrency(city.avg_home_price)}</p>
                              <p className="font-medium">Ratio: {formatRatio(city.avg_rent_home_ratio)}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Data from: {new Date(city.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Rectangle>
                    )
                  })}
                </MapContainer>
              )}
              
              {isLoading && (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading map data...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Historical Data Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Historical Trends: {selectedItem}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {historicalData.length > 0 && `${historicalData[0].date} - ${historicalData[historicalData.length - 1].date}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedItem(null)
                  setHistoricalData([])
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Rent & Home Price Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Rent & Home Prices</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" label={{ value: 'Rent ($)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Home Price ($K)', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Avg Rent" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="Avg Home Price" stroke="#82ca9d" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Rent/Home Ratio Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent-to-Home Price Ratio</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Ratio (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Rent/Home Ratio" stroke="#ff7300" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Latest Values */}
              {historicalData.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Latest Rent</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${historicalData[historicalData.length - 1]['Avg Rent'].toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Latest Home Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${(historicalData[historicalData.length - 1]['Avg Home Price'] * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Latest Ratio</p>
                    <p className="text-xl font-bold text-gray-900">
                      {historicalData[historicalData.length - 1]['Rent/Home Ratio']}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}