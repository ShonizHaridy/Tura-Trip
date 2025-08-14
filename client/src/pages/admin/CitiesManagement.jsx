// CitiesManagement.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AddCityModal from '../../components/admin/AddCityModal';
import EditCityModal from '../../components/admin/EditCityModal';
import { Edit2, Trash, Add, SearchNormal1, Location } from 'iconsax-react';
import adminService from '../../services/adminService';

const CitiesManagement = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  
  // ✅ FIXED: Proper search state management
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // ✅ FIXED: Proper debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ FIXED: Fetch cities once
  useEffect(() => {
    fetchCities();
  }, []);

  // ✅ FIXED: Filter cities when debounced search changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (city.description && city.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
      setFilteredCities(filtered);
    }
  }, [cities, debouncedSearchTerm]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCities();
      if (response.success) {
        setCities(response.data);
        setFilteredCities(response.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (cityData) => {
    await fetchCities(); // Refresh the list
    setShowAddModal(false);
  };

  const handleEditCity = async (cityData) => {
    await fetchCities(); // Refresh the list
    setEditingCity(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        const response = await adminService.deleteCity(id);
        if (response.success) {
          await fetchCities(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting city:', error);
      }
    }
  };

  const toggleCityStatus = async (id, currentStatus) => {
    try {
      const response = await adminService.toggleCityStatus(id);
      if (response.success) {
        setCities(cities.map(city => 
          city.id === id 
            ? { ...city, is_active: !currentStatus }
            : city
        ));
      }
    } catch (error) {
      console.error('Error updating city status:', error);
    }
  };

  return (
    <AdminLayout activeItem="Cities">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">          
          {/* Add New City Button Row */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sea-green-700 hover:bg-sea-green-900 text-white rounded-sm font-medium transition-colors"
            >
              <Add size="16" color="#ffffff" />
              Add New City
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-4 bg-white p-4 border-1 border-dark-blue-50 rounded-md'>
          {/* Search Row */}
          <div className="flex justify-between items-center">
            <h2 className="text-[28px] font-medium font-family-primary text-sea-green-800">All Cities</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-rose-black-500 shadow-md placeholder-white-300 focus:border-transparent w-80"
              />
              <SearchNormal1 size="16" color="#9ca3af" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
              
              {/* ✅ ADDED: Typing indicator */}
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Cities Table */}
          <div className="bg-white rounded-md shadow-sm border border-[#E6E6E8]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[#E6E6E8] bg-danim-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-base font-normal text-rose-black-500 font-primary">
                      City Name
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-rose-black-500 font-primary">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-rose-black-500 font-primary">
                      Number of Tours
                    </th>
                    <th className="px-4 py-3 text-left text-base font-normal text-rose-black-500 font-primary">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-base font-normal text-rose-black-500 font-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E6E8] bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sea-green-500"></div>
                          <span className="ml-2 text-rose-black-300">Loading cities...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCities.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-rose-black-300">
                        {searchTerm ? `No cities found for "${searchTerm}".` : 'No cities found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCities.map((city) => (
                      <tr key={city.id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-[93px] h-10 bg-danim-50 rounded flex items-center justify-center flex-shrink-0">
                              {city.image_url ? (
                                <img
                                  src={city.image_url}
                                  alt={city.name}
                                  className="w-full h-full rounded object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <Location size="24" color="#0B101A" style={{ display: city.image_url ? 'none' : 'block' }} />
                            </div>
                            
                            <div>
                              <div className="text-base font-normal text-rose-black-300 font-primary leading-[120%]">
                                {city.name}
                              </div>
                              <div className="text-xs text-rose-black-200 font-primary">
                                Location
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="text-sm text-rose-black-300 max-w-md font-primary leading-[120%]">
                            {city.description && city.description.length > 100
                              ? `${city.description.substring(0, 100)}...`
                              : city.description || 'No description available'
                            }
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="text-base font-normal text-rose-black-300 font-primary leading-[120%]">
                            {city.tours_count || city.active_tours_count || 0}
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleCityStatus(city.id, city.is_active)}
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-[10px] text-xs font-normal font-primary transition-colors ${
                              city.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {city.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => setEditingCity(city)}
                              className="p-2 hover:bg-[#F9F9F9] rounded transition-colors"
                            >
                              <Edit2 size="24" color="#8A8D95" />
                            </button>
                            <button
                              onClick={() => handleDelete(city.id)}
                              className="p-2 hover:bg-[#F9F9F9] rounded transition-colors"
                            >
                              <Trash size="24" color="#8A8D95" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add City Modal */}
        {showAddModal && (
          <AddCityModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddCity}
          />
        )}

        {/* Edit City Modal */}
        {editingCity && (
          <EditCityModal
            city={editingCity}
            onClose={() => setEditingCity(null)}
            onSave={handleEditCity}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CitiesManagement;