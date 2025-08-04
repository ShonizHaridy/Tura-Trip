// src/pages/admin/CommissionSettings.jsx
import React, { useState, useEffect } from 'react';
import { MoneyRecive } from 'iconsax-react';
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from '../../services/adminService';

const CommissionSettings = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedCommissions, setEditedCommissions] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch exchange rates and commission rates
      const [ratesResponse, commissionsResponse] = await Promise.all([
        adminService.getCurrencies(), 
        adminService.getCommissionRates()
      ]);

      console.log(ratesResponse,commissionsResponse )

      if (ratesResponse.success) {
        setExchangeRates(ratesResponse.data);
      }

      if (commissionsResponse.success) {
        setCommissions(commissionsResponse.data);
        
        // Initialize edited commissions with current values
        const initialEdited = {};
        commissionsResponse.data.forEach(commission => {
          initialEdited[commission.currency_code] = commission.commission_amount.toString();
        });
        setEditedCommissions(initialEdited);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommissionChange = (currencyCode, value) => {
    setEditedCommissions(prev => ({
      ...prev,
      [currencyCode]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update all changed commissions
      const updatePromises = Object.entries(editedCommissions).map(([currencyCode, amount]) => {
        const currentCommission = commissions.find(c => c.currency_code === currencyCode);
        const currentAmount = currentCommission ? currentCommission.commission_amount.toString() : '0';
        
        // Only update if value has changed
        if (amount !== currentAmount) {
          return adminService.updateCommissionRate({
            currency_code: currencyCode,
            commission_amount: parseFloat(amount)
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      
      // Refresh data after saving
      await fetchData();
      
      console.log('Commission rates updated successfully');
    } catch (error) {
      console.error('Error saving commission rates:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    const originalEdited = {};
    commissions.forEach(commission => {
      originalEdited[commission.currency_code] = commission.commission_amount.toString();
    });
    setEditedCommissions(originalEdited);
  };

  // Check if any values have been changed
  const hasChanges = Object.keys(editedCommissions).some(currencyCode => {
    const currentCommission = commissions.find(c => c.currency_code === currencyCode);
    const currentAmount = currentCommission ? currentCommission.commission_amount.toString() : '0';
    return editedCommissions[currencyCode] !== currentAmount;
  });

  if (loading) {
    return (
      <AdminLayout activeItem="Commission">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-600">Loading commission settings...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="Commission">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
              <MoneyRecive size="20" color="#ffffff" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Commission Settings</h1>
          </div>
          <p className="text-gray-600">View current exchange rates and manage organizer commission amounts</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">Currency Converter</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - Today's Price (Exchange Rates) */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-6">Today's Price</h3>
              <div className="space-y-4">
                {exchangeRates.map((currency) => (
                  <div key={`rate-${currency.code}`} className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-16">Amount</span>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={parseFloat(currency.exchange_rate).toFixed(2)}
                        readOnly
                        className="w-full px-4 text-rose-black-500 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg font-medium text-gray-700">
                        {currency.symbol}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                * Exchange rates for 1 USD
              </div>
            </div>

            {/* RIGHT SIDE - Organizer's Commission (Editable) */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-6">Organizer's commission</h3>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={`commission-${commission.currency_code}`} className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-16">Amount</span>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editedCommissions[commission.currency_code] || '0'}
                        onChange={(e) => handleCommissionChange(commission.currency_code, e.target.value)}
                        className="w-full text-rose-black-500 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-700">
                        {commission.currency_symbol}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="mt-3 text-xs text-gray-500">
                * Commission added to tour prices
              </div> */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              disabled={saving || !hasChanges}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Status Message */}
          {hasChanges && !saving && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                You have unsaved changes to commission rates. Click "Save" to apply changes.
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Exchange Rates & Commissions
              </h4>
              <p className="text-sm text-blue-700">
                Exchange rates are updated automatically every few hours from FXRatesAPI. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CommissionSettings;