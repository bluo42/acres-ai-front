'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Map, Eye, Layers, Square, Trash2, Download } from 'lucide-react'

interface ADUPlan {
  id: string
  name: string
  width: number // in meters
  length: number // in meters
  sqft: number
  bedrooms: number
  bathrooms: number
  color: string
}

interface PlacedADU {
  id: string
  plan: ADUPlan
  rectangle: google.maps.Rectangle
  position: google.maps.LatLngLiteral
}

interface GoogleMapADUPlannerProps {
  address: string
  aduPlans: ADUPlan[]
  onADUsChange?: (adus: PlacedADU[]) => void
}

export default function GoogleMapADUPlanner({ address, aduPlans, onADUsChange }: GoogleMapADUPlannerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null)
  
  const [selectedADUPlan, setSelectedADUPlan] = useState<ADUPlan>(aduPlans[0])
  const [placedADUs, setPlacedADUs] = useState<PlacedADU[]>([])
  const [mapType, setMapType] = useState<'satellite' | 'roadmap' | 'hybrid'>('satellite')
  const [showStreetView, setShowStreetView] = useState(false)
  const [propertyCenter, setPropertyCenter] = useState<google.maps.LatLngLiteral>({ lat: 34.0522, lng: -118.2437 })
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isPlacingMode, setIsPlacingMode] = useState(false)

  // Initialize Google Map
  useEffect(() => {
    if (!window.google || !mapRef.current || googleMapRef.current) return

    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
      center: propertyCenter,
      zoom: 20,
      mapTypeId: mapType,
      tilt: 0,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    googleMapRef.current = map

    // Geocode the address
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        map.setCenter(location)
        setPropertyCenter({ lat: location.lat(), lng: location.lng() })
        
        // Add a marker for the property
        new google.maps.Marker({
          position: location,
          map,
          title: address,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        })
      }
    })

    setIsMapLoaded(true)

    return () => {
      // Cleanup
      placedADUs.forEach(adu => adu.rectangle.setMap(null))
    }
  }, [address, mapType])

  // Update map type
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(mapType)
    }
  }, [mapType])

  // Initialize Street View
  const toggleStreetView = () => {
    if (!googleMapRef.current) return

    if (showStreetView) {
      setShowStreetView(false)
      return
    }

    const streetViewService = new google.maps.StreetViewService()
    
    streetViewService.getPanorama(
      { location: propertyCenter, radius: 50 },
      (data, status) => {
        if (status === 'OK' && data && data.location) {
          if (!streetViewRef.current) {
            streetViewRef.current = new google.maps.StreetViewPanorama(
              document.getElementById('street-view')!,
              {
                position: data.location.latLng,
                pov: { heading: 0, pitch: 0 },
                zoom: 1
              }
            )
          } else {
            streetViewRef.current.setPosition(data.location.latLng!)
          }
          setShowStreetView(true)
        } else {
          alert('Street View is not available for this location')
        }
      }
    )
  }

  // Convert meters to lat/lng offset based on latitude
  const metersToLatLng = (meters: number, lat: number) => {
    // Approximate conversion (varies by latitude)
    const latOffset = meters / 111320 // 1 degree latitude = ~111,320 meters
    const lngOffset = meters / (111320 * Math.cos(lat * Math.PI / 180)) // Longitude varies by latitude
    return { latOffset, lngOffset }
  }

  // Place ADU at clicked location
  const placeADUAtLocation = (location: google.maps.LatLng) => {
    if (!googleMapRef.current) return

    const lat = location.lat()
    const lng = location.lng()
    
    // Convert ADU dimensions from meters to lat/lng offsets
    const { latOffset: heightOffset } = metersToLatLng(selectedADUPlan.length / 2, lat)
    const { lngOffset: widthOffset } = metersToLatLng(selectedADUPlan.width / 2, lat)
    
    // Create rectangle with fixed size centered at click location
    const rectangle = new google.maps.Rectangle({
      bounds: {
        north: lat + heightOffset,
        south: lat - heightOffset,
        east: lng + widthOffset,
        west: lng - widthOffset
      },
      fillColor: selectedADUPlan.color,
      fillOpacity: 0.5,
      strokeWeight: 2,
      strokeColor: '#000000',
      editable: true,
      draggable: true,
      map: googleMapRef.current
    })

    const newADU: PlacedADU = {
      id: `adu-${Date.now()}`,
      plan: selectedADUPlan,
      rectangle,
      position: { lat, lng }
    }
    
    setPlacedADUs(prev => [...prev, newADU])
    
    // Add click listener to remove
    google.maps.event.addListener(rectangle, 'click', () => {
      if (window.confirm(`Remove ${selectedADUPlan.name}?`)) {
        rectangle.setMap(null)
        setPlacedADUs(prev => prev.filter(adu => adu.id !== newADU.id))
      }
    })
    
    // Exit placing mode after placing ADU
    setIsPlacingMode(false)
  }

  // Toggle placing mode
  const startPlacingADU = () => {
    if (!googleMapRef.current) return
    
    if (isPlacingMode) {
      // Cancel placing mode
      setIsPlacingMode(false)
    } else {
      // Enter placing mode
      setIsPlacingMode(true)
    }
  }

  // Handle map clicks when in placing mode
  useEffect(() => {
    if (!googleMapRef.current) return

    // Remove existing listener
    if (mapClickListenerRef.current) {
      google.maps.event.removeListener(mapClickListenerRef.current)
      mapClickListenerRef.current = null
    }

    if (isPlacingMode) {
      // Change cursor to crosshair
      googleMapRef.current.setOptions({ draggableCursor: 'crosshair' })
      
      // Add click listener
      mapClickListenerRef.current = google.maps.event.addListener(
        googleMapRef.current, 
        'click', 
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            placeADUAtLocation(e.latLng)
          }
        }
      )
    } else {
      // Reset cursor
      googleMapRef.current.setOptions({ draggableCursor: null })
    }

    return () => {
      if (mapClickListenerRef.current) {
        google.maps.event.removeListener(mapClickListenerRef.current)
      }
    }
  }, [isPlacingMode, selectedADUPlan])

  // Clear all ADUs
  const clearAllADUs = () => {
    placedADUs.forEach(adu => adu.rectangle.setMap(null))
    setPlacedADUs([])
  }

  // Notify parent of ADU changes
  useEffect(() => {
    if (onADUsChange) {
      onADUsChange(placedADUs)
    }
  }, [placedADUs, onADUsChange])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`}
        strategy="lazyOnload"
      />
      
      <div className="space-y-4">
        {/* ADU Plan Selector */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Select ADU Type</h3>
          <div className="grid grid-cols-3 gap-2">
            {aduPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedADUPlan(plan)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedADUPlan.id === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{plan.name}</span>
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: plan.color }}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  {plan.sqft} sq ft • {plan.bedrooms}BR/{plan.bathrooms}BA
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={startPlacingADU}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                isPlacingMode
                  ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                  : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Square className="h-4 w-4 mr-1" />
              {isPlacingMode ? 'Cancel Placing' : `Place ${selectedADUPlan.name}`}
            </button>
            
            <button
              onClick={toggleStreetView}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              {showStreetView ? 'Hide' : 'Show'} Street View
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as 'satellite' | 'roadmap' | 'hybrid')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
              <option value="roadmap">Map</option>
            </select>

            {placedADUs.length > 0 && (
              <button
                onClick={clearAllADUs}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>How to use:</strong> Select an ADU type, click "Place ADU", then click on the map where you want to place it. 
            The ADU will be placed with its specified dimensions ({selectedADUPlan.width}m × {selectedADUPlan.length}m). 
            Click on placed ADUs to remove them. You can drag ADUs to reposition them after placement.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-gray-300"
          />
          
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          )}
        </div>

        {/* Street View Container */}
        {showStreetView && (
          <div 
            id="street-view" 
            className="w-full h-64 rounded-lg border border-gray-300"
          />
        )}

        {/* Placed ADUs Summary */}
        {placedADUs.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-medium text-green-900 mb-2">
              Placed ADUs ({placedADUs.length}):
            </p>
            <div className="space-y-1">
              {placedADUs.map((adu) => (
                <div key={adu.id} className="flex items-center justify-between text-xs">
                  <span className="flex items-center">
                    <div
                      className="w-2 h-2 rounded mr-2"
                      style={{ backgroundColor: adu.plan.color }}
                    />
                    {adu.plan.name} - {adu.plan.sqft} sq ft
                  </span>
                  <button
                    onClick={() => {
                      adu.rectangle.setMap(null)
                      setPlacedADUs(prev => prev.filter(a => a.id !== adu.id))
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}