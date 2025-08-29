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
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null)
  
  const [selectedADUPlan, setSelectedADUPlan] = useState<ADUPlan>(aduPlans[0])
  const [placedADUs, setPlacedADUs] = useState<PlacedADU[]>([])
  const [mapType, setMapType] = useState<'satellite' | 'roadmap' | 'hybrid'>('satellite')
  const [showStreetView, setShowStreetView] = useState(false)
  const [propertyCenter, setPropertyCenter] = useState<google.maps.LatLngLiteral>({ lat: 34.0522, lng: -118.2437 })
  const [isMapLoaded, setIsMapLoaded] = useState(false)

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

    // Initialize drawing manager
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      rectangleOptions: {
        fillColor: selectedADUPlan.color,
        fillOpacity: 0.5,
        strokeWeight: 2,
        strokeColor: '#000000',
        editable: true,
        draggable: true
      }
    })

    drawingManager.setMap(map)
    drawingManagerRef.current = drawingManager

    // Handle rectangle complete event
    google.maps.event.addListener(drawingManager, 'rectanglecomplete', (rectangle: google.maps.Rectangle) => {
      const bounds = rectangle.getBounds()
      if (bounds) {
        const center = bounds.getCenter()
        const newADU: PlacedADU = {
          id: `adu-${Date.now()}`,
          plan: selectedADUPlan,
          rectangle,
          position: { lat: center.lat(), lng: center.lng() }
        }
        
        setPlacedADUs(prev => [...prev, newADU])
        
        // Add click listener to remove
        google.maps.event.addListener(rectangle, 'click', () => {
          if (window.confirm(`Remove ${selectedADUPlan.name}?`)) {
            rectangle.setMap(null)
            setPlacedADUs(prev => prev.filter(adu => adu.id !== newADU.id))
          }
        })
      }
      
      // Reset drawing mode
      drawingManager.setDrawingMode(null)
    })

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
  }, [address, mapType, selectedADUPlan])

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

  // Place ADU using drawing manager
  const startPlacingADU = () => {
    if (!drawingManagerRef.current || !googleMapRef.current) return

    // Update drawing manager options with selected ADU colors
    drawingManagerRef.current.setOptions({
      rectangleOptions: {
        fillColor: selectedADUPlan.color,
        fillOpacity: 0.5,
        strokeWeight: 2,
        strokeColor: '#000000',
        editable: true,
        draggable: true
      }
    })

    drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE)
  }

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
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,drawing,geometry`}
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
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Square className="h-4 w-4 mr-1" />
              Place {selectedADUPlan.name}
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
            <strong>How to use:</strong> Select an ADU type, click "Place ADU", then draw a rectangle on the map where you want to place it. 
            Click on placed ADUs to remove them. Use Street View to see the property from street level.
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