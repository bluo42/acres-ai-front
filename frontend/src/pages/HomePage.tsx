import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { propertyApi } from '../services/api';
import { PropertySummary } from '../types';
import { Calculator, MapPin, DollarSign, Home, Bath, Bed } from 'lucide-react';

const HomePage: React.FC = () => {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: propertyApi.getProperties,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading properties</h3>
            <div className="mt-2 text-sm text-red-700">
              Please check your connection and try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Property Portfolio
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and underwrite your real estate investments
          </p>
        </div>
      </div>

      {properties && properties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add properties to your Supabase database to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties?.map((property: PropertySummary) => (
            <div
              key={property.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900 truncate">
                      {property.property}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="ml-1 text-sm text-gray-500">Price</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(property.price)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-blue-500" />
                      <span className="ml-1 text-xs text-gray-500">Units</span>
                      <span className="ml-1 font-medium">{property.current_units}</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 text-purple-500" />
                      <span className="ml-1 text-xs text-gray-500">Beds</span>
                      <span className="ml-1 font-medium">{property.current_beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 text-cyan-500" />
                      <span className="ml-1 text-xs text-gray-500">Baths</span>
                      <span className="ml-1 font-medium">{property.current_baths}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Lot Size</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(property.lot_size)} sq ft
                    </span>
                  </div>

                  {property.additional_units > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">Additional Units</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        +{property.additional_units}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Link
                    to={`/underwriting/${property.id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Analyze Property
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;