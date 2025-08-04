const { pool } = require('../config/database');
const currencyService = require('../services/currencyService');

class CurrencyController {
  // Get all currencies
  // In CurrencyController.js - update getAllCurrencies
async getAllCurrencies(req, res) {
  try {
    const { active_only = false } = req.query;

    let query = `SELECT * FROM currencies 
                 WHERE code NOT IN ('USD', 'EUR')`;
    
    if (active_only === 'true') {
      query += ' AND is_active = true';
    }
    
    query += ' ORDER BY code ASC';

    const [currencies] = await pool.execute(query);

    res.json({
      success: true,
      data: currencies
    });
  } catch (error) {
    console.error('Get all currencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

  // Get exchange rates
  async getExchangeRates(req, res) {
    try {
      const rates = await currencyService.getCurrentRates();
      
      if (!rates) {
        return res.status(503).json({
          success: false,
          message: 'Currency service temporarily unavailable'
        });
      }

      res.json({
        success: true,
        data: rates
      });
    } catch (error) {
      console.error('Get exchange rates error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Convert currency with organizer commission
  async convertCurrency(req, res) {
    try {
      const { amount, from_currency = 'USD', to_currency } = req.body;

      if (!amount || !to_currency) {
        return res.status(400).json({
          success: false,
          message: 'Amount and target currency are required'
        });
      }

      const result = await currencyService.convertWithCommission(
        parseFloat(amount), 
        from_currency, 
        to_currency
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Currency conversion failed'
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Convert currency error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update currency
  async updateCurrency(req, res) {
    try {
      const { id } = req.params;
      const { name, symbol, is_active } = req.body;

      const [existingCurrency] = await pool.execute(
        'SELECT * FROM currencies WHERE id = ?',
        [id]
      );

      if (existingCurrency.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Currency not found'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }

      if (symbol !== undefined) {
        updateFields.push('symbol = ?');
        updateValues.push(symbol);
      }

      if (is_active !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(is_active);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await pool.execute(
        `UPDATE currencies SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Currency updated successfully'
      });
    } catch (error) {
      console.error('Update currency error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get organizer commission
  async getOrganizerCommission(req, res) {
    try {
      const [commissions] = await pool.execute(`
        SELECT 
          oc.*,
          c.name as currency_name,
          c.symbol as currency_symbol
        FROM organizer_commission oc
        LEFT JOIN currencies c ON oc.currency_code = c.code
        WHERE oc.is_active = true
        ORDER BY oc.currency_code ASC
      `);

      res.json({
        success: true,
        data: commissions
      });
    } catch (error) {
      console.error('Get organizer commission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create or update organizer commission
  async updateOrganizerCommission(req, res) {
    try {
      // Get currency_code from URL params if it exists, otherwise from body
      const currency_code = req.params.currency_code || req.body.currency_code;
      const { commission_amount } = req.body;

      console.log('💰 Update commission request:', { currency_code, commission_amount, params: req.params, body: req.body });

      if (!currency_code || commission_amount === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Currency code and commission amount are required'
        });
      }

      // Check if commission exists
      const [existingCommission] = await pool.execute(
        'SELECT id FROM organizer_commission WHERE currency_code = ?',
        [currency_code]
      );

      if (existingCommission.length > 0) {
        // Update existing commission
        await pool.execute(
          'UPDATE organizer_commission SET commission_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE currency_code = ?',
          [parseFloat(commission_amount), currency_code]
        );
      } else {
        // Insert new commission
        await pool.execute(
          'INSERT INTO organizer_commission (currency_code, commission_amount, is_active) VALUES (?, ?, true)',
          [currency_code, parseFloat(commission_amount)]
        );
      }

      res.json({
        success: true,
        message: 'Organizer commission updated successfully'
      });
    } catch (error) {
      console.error('❌ Update organizer commission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete organizer commission
  async deleteOrganizerCommission(req, res) {
    try {
      const { currency_code } = req.params;

      const [result] = await pool.execute(
        'DELETE FROM organizer_commission WHERE currency_code = ?',
        [currency_code]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Commission not found'
        });
      }

      res.json({
        success: true,
        message: 'Organizer commission deleted successfully'
      });
    } catch (error) {
      console.error('Delete organizer commission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Force refresh exchange rates
  async refreshRates(req, res) {
    try {
      await currencyService.updateExchangeRates();

      res.json({
        success: true,
        message: 'Exchange rates refreshed successfully'
      });
    } catch (error) {
      console.error('Refresh rates error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh exchange rates'
      });
    }
  }
}

module.exports = new CurrencyController();