'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as turf from '@turf/turf'
import { Home, Move, RotateCw, Download, Trash2, Square, Search, MapPin, X } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

// Set Mapbox access token
if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  console.error('Mapbox token is missing! Please set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file')
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface ADUPlan {
  id: string
  name: string
  width: number
  length: number
  sqft: number
  bedrooms: number
  bathrooms: number
  color: string
  imageUrl?: string
}

interface SearchResult {
  id: string
  place_name: string
  center: [number, number]
  text: string
  properties?: {
    address?: string
  }
}

const aduPlans: ADUPlan[] = [
  {
    id: 'studio-400',
    name: 'Studio ADU',
    width: 6.1,
    length: 12.2,
    sqft: 400,
    bedrooms: 0,
    bathrooms: 1,
    color: '#3b82f6'
  },
  {
    id: '1br-600',
    name: '1 Bedroom ADU',
    width: 7.6,
    length: 15.2,
    sqft: 600,
    bedrooms: 1,
    bathrooms: 1,
    color: '#10b981'
  },
  {
    id: '2br-800',
    name: '2 Bedroom ADU',
    width: 9.1,
    length: 18.3,
    sqft: 800,
    bedrooms: 2,
    bathrooms: 1,
    color: '#8b5cf6'
  },
  {
    id: '2br-1000',
    name: '2BR + Office ADU',
    width: 10.7,
    length: 21.3,
    sqft: 1000,
    bedrooms: 2,
    bathrooms: 2,
    color: '#f59e0b'
  }
]

export default function ADUPlannerPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)
  const [selectedADU, setSelectedADU] = useState<ADUPlan>(aduPlans[0])
  const [placedADUs, setPlacedADUs] = useState<any[]>([])
  const [currentMode, setCurrentMode] = useState<'select' | 'place'>('select')
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const propertyMarkerRef = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (map.current) return
    if (!mapContainer.current) return

    // Check if token is available
    if (!mapboxgl.accessToken) {
      console.error('Mapbox token not set. Map will not load.')
      setMapError('Mapbox API token is missing. Please check your configuration.')
      return
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-118.2437, 34.0522],
        zoom: 18,
        pitch: 0,
        bearing: 0
      })
      
      // Clear any previous errors once map loads successfully
      map.current.once('load', () => {
        setMapError(null)
      })
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        if (e.error && e.error.status === 401) {
          setMapError('Invalid Mapbox token. Please check your API key.')
        } else {
          setMapError('Failed to load map. Please check your internet connection.')
        }
      })
    } catch (error) {
      console.error('Error initializing Mapbox map:', error)
      setMapError('Failed to initialize map. Please check the console for details.')
      return
    }

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: false
      },
      defaultMode: 'simple_select'
    })

    map.current.addControl(draw.current)

    map.current.on('load', () => {
      map.current!.addSource('parcels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      map.current!.addLayer({
        id: 'parcels-fill',
        type: 'fill',
        source: 'parcels',
        paint: {
          'fill-color': '#ffffff',
          'fill-opacity': 0.1
        }
      })

      map.current!.addLayer({
        id: 'parcels-outline',
        type: 'line',
        source: 'parcels',
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      map.current!.addSource('adu-footprints', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      map.current!.addLayer({
        id: 'adu-footprints-fill',
        type: 'fill',
        source: 'adu-footprints',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.7
        }
      })

      map.current!.addLayer({
        id: 'adu-footprints-outline',
        type: 'line',
        source: 'adu-footprints',
        paint: {
          'line-color': '#000000',
          'line-width': 2
        }
      })

      map.current!.addLayer({
        id: 'adu-labels',
        type: 'symbol',
        source: 'adu-footprints',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      })
    })

    map.current.on('click', 'adu-footprints-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        setSelectedFeatureId(feature.properties?.id || null)
      }
    })

    map.current.on('click', (e) => {
      if (currentMode === 'place') {
        placeADU(e.lngLat)
      }
    })

    return () => {
      // Clean up property marker
      if (propertyMarkerRef.current) {
        propertyMarkerRef.current.remove()
        propertyMarkerRef.current = null
      }
      // Clean up search timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      // Clean up map
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (map.current) {
      map.current.getCanvas().style.cursor = currentMode === 'place' ? 'crosshair' : 'grab'
    }
  }, [currentMode])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.address-search-container')) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Address search functionality
  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    setShowSearchResults(true)

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${mapboxgl.accessToken}&` +
        `country=US&` +
        `types=address,poi&` +
        `limit=5`
      )
      
      if (!response.ok) {
        throw new Error('Failed to search address')
      }

      const data = await response.json()
      setSearchResults(data.features || [])
    } catch (error) {
      console.error('Error searching address:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input changes with debounce
  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value)
    }, 300)
  }

  // Handle selecting a search result
  const handleSelectAddress = (result: SearchResult) => {
    if (!map.current) return

    // Fly to the selected location
    map.current.flyTo({
      center: result.center,
      zoom: 18,
      duration: 2000
    })

    // Remove previous property marker if it exists
    if (propertyMarkerRef.current) {
      propertyMarkerRef.current.remove()
    }

    // Add a new property marker for the selected location
    const marker = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(result.center)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <p class="font-semibold text-gray-900">${result.text}</p>
          <p class="text-xs text-gray-600">${result.place_name}</p>
          <p class="text-xs text-blue-600 mt-2">Click "Place ADU" to add ADUs here</p>
        </div>
      `))
      .addTo(map.current)
    
    // Show popup immediately
    marker.togglePopup()
    
    // Store reference to the marker
    propertyMarkerRef.current = marker

    // Update search field with selected address
    setSearchQuery(result.text)
    setShowSearchResults(false)
    setSearchResults([])
    
    // Switch to place mode automatically for convenience
    setCurrentMode('place')
  }

  const placeADU = (lngLat: mapboxgl.LngLat) => {
    if (!map.current) return

    const center = [lngLat.lng, lngLat.lat]
    const bearing = 0

    const widthInMeters = selectedADU.width
    const lengthInMeters = selectedADU.length

    const topLeft = turf.destination(
      turf.destination(center, widthInMeters / 2 / 1000, -90),
      lengthInMeters / 2 / 1000,
      0
    )
    const topRight = turf.destination(
      turf.destination(center, widthInMeters / 2 / 1000, 90),
      lengthInMeters / 2 / 1000,
      0
    )
    const bottomRight = turf.destination(
      turf.destination(center, widthInMeters / 2 / 1000, 90),
      lengthInMeters / 2 / 1000,
      180
    )
    const bottomLeft = turf.destination(
      turf.destination(center, widthInMeters / 2 / 1000, -90),
      lengthInMeters / 2 / 1000,
      180
    )

    const polygon = turf.polygon([[
      turf.getCoord(topLeft),
      turf.getCoord(topRight),
      turf.getCoord(bottomRight),
      turf.getCoord(bottomLeft),
      turf.getCoord(topLeft)
    ]], {
      id: `adu-${Date.now()}`,
      name: selectedADU.name,
      color: selectedADU.color,
      sqft: selectedADU.sqft,
      bedrooms: selectedADU.bedrooms,
      bathrooms: selectedADU.bathrooms,
      bearing: bearing
    })

    const newPlacedADUs = [...placedADUs, polygon]
    setPlacedADUs(newPlacedADUs)
    updateADULayer(newPlacedADUs)
    setCurrentMode('select')
  }

  const updateADULayer = (adus: any[]) => {
    if (!map.current) return

    const source = map.current.getSource('adu-footprints') as mapboxgl.GeoJSONSource
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: adus
      })
    }
  }

  const rotateSelectedADU = (degrees: number) => {
    if (!selectedFeatureId || !map.current) return

    const updatedADUs = placedADUs.map(adu => {
      if (adu.properties.id === selectedFeatureId) {
        const center = turf.center(adu)
        const rotated = turf.transformRotate(adu, degrees, { pivot: center })
        rotated.properties = {
          ...adu.properties,
          bearing: (adu.properties.bearing + degrees) % 360
        }
        return rotated
      }
      return adu
    })

    setPlacedADUs(updatedADUs)
    updateADULayer(updatedADUs)
  }

  const deleteSelectedADU = () => {
    if (!selectedFeatureId) return

    const updatedADUs = placedADUs.filter(adu => adu.properties.id !== selectedFeatureId)
    setPlacedADUs(updatedADUs)
    updateADULayer(updatedADUs)
    setSelectedFeatureId(null)
  }

  const exportPlan = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      adus: placedADUs.map(adu => ({
        id: adu.properties.id,
        name: adu.properties.name,
        sqft: adu.properties.sqft,
        bedrooms: adu.properties.bedrooms,
        bathrooms: adu.properties.bathrooms,
        bearing: adu.properties.bearing,
        geometry: adu.geometry
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `adu-plan-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">ADU Planner</h1>
          <p className="text-sm text-gray-600 mt-1">Drag and drop ADU plans onto your property</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Address Search */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Property Search</h2>
            <div className="relative address-search-container">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Enter an address..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                      setShowSearchResults(false)
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelectAddress(result)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{result.text}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{result.place_name}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : searchQuery.length >= 3 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No results found</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Search for an address to navigate to that location
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Available Plans</h2>
            <div className="space-y-2">
              {aduPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedADU(plan)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedADU.id === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{plan.name}</span>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: plan.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 text-left">
                    <div>{plan.sqft} sq ft • {plan.width}m × {plan.length}m</div>
                    <div>
                      {plan.bedrooms > 0 ? `${plan.bedrooms} bed` : 'Studio'} • {plan.bathrooms} bath
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Controls</h2>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentMode(currentMode === 'place' ? 'select' : 'place')}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  currentMode === 'place'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Square className="w-4 h-4 mr-2" />
                {currentMode === 'place' ? 'Placing ADU...' : 'Place ADU'}
              </button>

              <button
                onClick={() => rotateSelectedADU(90)}
                disabled={!selectedFeatureId}
                className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate Selected
              </button>

              <button
                onClick={deleteSelectedADU}
                disabled={!selectedFeatureId}
                className="w-full px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>

              <button
                onClick={exportPlan}
                disabled={placedADUs.length === 0}
                className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Plan
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Placed ADUs</h2>
            {placedADUs.length === 0 ? (
              <p className="text-sm text-gray-500">No ADUs placed yet</p>
            ) : (
              <div className="space-y-2">
                {placedADUs.map((adu) => (
                  <div
                    key={adu.properties.id}
                    onClick={() => setSelectedFeatureId(adu.properties.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFeatureId === adu.properties.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{adu.properties.name}</span>
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: adu.properties.color }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {adu.properties.sqft} sq ft • Rotation: {adu.properties.bearing}°
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Map Loading Error</h3>
              <p className="text-gray-700 mb-4">{mapError}</p>
              <div className="text-sm text-gray-600">
                <p className="mb-2">To fix this issue:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check that your Mapbox token is valid</li>
                  <li>Verify the token is in your .env.local file</li>
                  <li>Restart your development server after adding the token</li>
                </ol>
                <p className="mt-3">
                  Get a free token at{' '}
                  <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    mapbox.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <p className="text-sm font-medium text-gray-700">
              {currentMode === 'place' 
                ? 'Click on the map to place the ADU' 
                : 'Select an ADU plan and click "Place ADU"'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}