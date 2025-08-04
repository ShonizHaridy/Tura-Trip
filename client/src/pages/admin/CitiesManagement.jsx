// src/pages/admin/CitiesManagement.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Edit2, Trash, Add, SearchNormal1, Location } from 'iconsax-react';
import adminService from '../../services/adminService';

const CitiesManagement = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    hero_image: null,
    is_active: true
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCities();
      if (response.success) {
        setCities(response.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('slug', formData.slug);
      submitData.append('description', formData.description);
      submitData.append('long_description', formData.long_description);
      submitData.append('is_active', formData.is_active);
      
      if (formData.hero_image) {
        submitData.append('hero_image', formData.hero_image);
      }

      let response;
      if (editingCity) {
        response = await adminService.updateCity(editingCity.id, submitData);
      } else {
        response = await adminService.createCity(submitData);
      }

      if (response.success) {
        await fetchCities(); // Refresh the list
        resetForm();
        setShowAddModal(false);
        setEditingCity(null);
        // You might want to show a success toast here
      }
    } catch (error) {
      console.error('Error saving city:', error);
      // You might want to show an error toast here
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        const response = await adminService.deleteCity(id);
        if (response.success) {
          await fetchCities(); // Refresh the list
          // Show success toast
        }
      } catch (error) {
        console.error('Error deleting city:', error);
        // Show error toast
      }
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      slug: city.slug,
      description: city.description || '',
      long_description: city.long_description || '',
      hero_image: null, // Don't pre-load the file
      is_active: city.is_active
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      long_description: '',
      hero_image: null,
      is_active: true
    });
  };

  const toggleCityStatus = async (id, currentStatus) => {
    try {
      const response = await adminService.toggleCityStatus(id);
      if (response.success) {
        // Update the local state immediately for better UX
        setCities(cities.map(city => 
          city.id === id 
            ? { ...city, is_active: !currentStatus }
            : city
        ));
      }
    } catch (error) {
      console.error('Error updating city status:', error);
      // Show error toast
    }
  };

  // Filter cities based on search term
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (city.description && city.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout activeItem="Cities">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cities Management</h1>
          
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

          {/* Search Row */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">All Cities</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-80"
              />
              <SearchNormal1 size="16" color="#9ca3af" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Cities Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    City Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Number of Tours
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                        <span className="ml-2 text-gray-500">Loading cities...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No cities found matching your search.' : 'No cities found.'}
                    </td>
                  </tr>
                ) : (
                  filteredCities.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* City Icon/Image */}
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {city.image ? (
                              <img
                                src={city.image_url} // The backend should return full URLs
                                alt={city.name}
                                className="w-full h-full rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <Location size="20" color="#9ca3af" style={{ display: city.image ? 'none' : 'block' }} />
                          </div>
                          
                          {/* City Name and Location */}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {city.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Location
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-md">
                          {city.description && city.description.length > 100
                            ? `${city.description.substring(0, 100)}...`
                            : city.description || 'No description available'
                          }
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {city.tours_count || city.active_tours_count || 0}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleCityStatus(city.id, city.is_active)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            city.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {city.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(city)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                          >
                            <Edit2 size="16" color="#6b7280" className="group-hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(city.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                          >
                            <Trash size="16" color="#6b7280" className="group-hover:text-red-600" />
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

        {/* Add/Edit City Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingCity ? 'Edit City' : 'Add New City'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      disabled={submitLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Brief description of the city..."
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  <textarea
                    value={formData.long_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Detailed description of the city..."
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_image: e.target.files[0] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={submitLoading}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    disabled={submitLoading}
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCity(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={submitLoading}
                  >
                    {submitLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {submitLoading 
                      ? (editingCity ? 'Updating...' : 'Adding...') 
                      : (editingCity ? 'Update City' : 'Add City')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CitiesManagement;