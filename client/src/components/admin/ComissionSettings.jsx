// src/components/admin/CommissionSettings.jsx
import React, { useState, useEffect } from 'react';
import commissionService from '../../services/commissionService';

const CommissionSettings = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const data = await commissionService.getCommissionSettings();
      setCommissions(data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (commission) => {
    setEditingId(commission.currency_code);
    setEditValue(commission.commission_value.toString());
  };

  const handleSave = async (currencyCode) => {
    try {
      await commissionService.updateCommission(currencyCode, parseFloat(editValue));
      await fetchCommissions();
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating commission:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h3>
      
      <div className="space-y-4">
        {commissions.map((commission) => (
          <div key={commission.currency_code} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{commission.currency_code}</span>
              <span className="text-gray-500">-</span>
            </div>
            
            <div className="flex items-center gap-3">
              {editingId === commission.currency_code ? (
                <>
                  <input
                    type="number"
                    step="0.01"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => handleSave(commission.currency_code)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium">{commission.commission_value}</span>
                  <button
                    onClick={() => handleEdit(commission)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommissionSettings;