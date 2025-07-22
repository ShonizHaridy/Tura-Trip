const { pool } = require('../config/database');
const cron = require('node-cron');

class CurrencyService {
  constructor() {
    this.API_URL = 'https://api.fxratesapi.com/latest?base=USD';
    this.updateInProgress = false;
    this.lastUpdateTime = null;
    this.cachedRates = null;
  }

  // Start automatic currency updates every 6 hours
  startCurrencyUpdater() {
    console.log('🔄 Starting currency rate updater...');
    
    // Update immediately on startup
    this.updateExchangeRates();
    
    // Schedule updates every 6 hours (0 */6 * * *)
    cron.schedule('0 */6 * * *', () => {
      console.log('⏰ Scheduled currency rate update triggered');
      this.updateExchangeRates();
    });

    console.log('✅ Currency updater started - rates will update every 6 hours');
  }

  // Fetch rates from FXRatesAPI
  async fetchRatesFromAPI() {
    try {
      const response = await fetch(this.API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.rates) {
        throw new Error('Invalid response format from currency API');
      }

      console.log('✅ Successfully fetched currency rates from FXRatesAPI');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch rates from FXRatesAPI:', error.message);
      throw error;
    }
  }

  // Update exchange rates in database
  async updateExchangeRates() {
    if (this.updateInProgress) {
      console.log('⚠️ Currency update already in progress, skipping...');
      return;
    }

    this.updateInProgress = true;

    try {
      console.log('🔄 Updating currency exchange rates...');
      
      const apiData = await this.fetchRatesFromAPI();
      const rates = apiData.rates;

      // Get all active currencies from database
      const [currencies] = await pool.execute(
        'SELECT code FROM currencies WHERE is_active = true'
      );

      const updates = [];
      
      for (const currency of currencies) {
        const code = currency.code;
        
        if (code === 'USD') {
          // USD is base currency, rate is 1
          updates.push(pool.execute(
            'UPDATE currencies SET exchange_rate = 1.000000, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
            ['USD']
          ));
        } else if (rates[code]) {
          // Update rate from API
          updates.push(pool.execute(
            'UPDATE currencies SET exchange_rate = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
            [rates[code], code]
          ));
        } else {
          console.warn(`⚠️ Rate not found for currency: ${code}`);
        }
      }

      await Promise.all(updates);

      this.lastUpdateTime = new Date();
      this.cachedRates = rates;

      console.log(`✅ Currency rates updated successfully at ${this.lastUpdateTime.toISOString()}`);
    } catch (error) {
      console.error('❌ Error updating currency rates:', error.message);
    } finally {
      this.updateInProgress = false;
    }
  }

  // Get current rates from database
  async getCurrentRates() {
    try {
      const [currencies] = await pool.execute(
        'SELECT code, name, symbol, exchange_rate, updated_at FROM currencies WHERE is_active = true ORDER BY code'
      );

      const ratesData = {
        rates: {},
        lastUpdate: null
      };

      currencies.forEach(currency => {
        ratesData.rates[currency.code] = {
          rate: parseFloat(currency.exchange_rate),
          name: currency.name,
          symbol: currency.symbol
        };

        // Find the most recent update time
        if (!ratesData.lastUpdate || currency.updated_at > ratesData.lastUpdate) {
          ratesData.lastUpdate = currency.updated_at;
        }
      });

      return ratesData;
    } catch (error) {
      console.error('Error getting current rates:', error);
      return null;
    }
  }

  // Convert currency with organizer commission
  async convertWithCommission(amount, fromCurrency = 'USD', toCurrency) {
    try {
      // Get exchange rates
      const [fromRate] = await pool.execute(
        'SELECT exchange_rate FROM currencies WHERE code = ? AND is_active = true',
        [fromCurrency]
      );

      const [toRate] = await pool.execute(
        'SELECT exchange_rate, name, symbol FROM currencies WHERE code = ? AND is_active = true',
        [toCurrency]
      );

      if (fromRate.length === 0 || toRate.length === 0) {
        throw new Error('Currency not found or inactive');
      }

      // Get organizer commission
      const [commission] = await pool.execute(
        'SELECT commission_amount FROM organizer_commission WHERE currency_code = ? AND is_active = true',
        [toCurrency]
      );

      const commissionAmount = commission.length > 0 ? parseFloat(commission[0].commission_amount) : 0;

      // Calculate conversion
      // First convert to USD (if not already), then to target currency
      let usdAmount = amount;
      if (fromCurrency !== 'USD') {
        usdAmount = amount / parseFloat(fromRate[0].exchange_rate);
      }

      const convertedAmount = usdAmount * parseFloat(toRate[0].exchange_rate);
      const finalAmount = convertedAmount + commissionAmount;

      return {
        originalAmount: amount,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        convertedAmount: Number(convertedAmount.toFixed(2)),
        commissionAmount: Number(commissionAmount.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),
        exchangeRate: parseFloat(toRate[0].exchange_rate),
        currencyInfo: {
          name: toRate[0].name,
          symbol: toRate[0].symbol
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Currency conversion error:', error);
      return null;
    }
  }

  // Test conversion function (similar to your sample)
  async testConversion(amount = 100) {
    try {
      const data = await this.fetchRatesFromAPI();
      
      if (!data || !data.rates) {
        console.error('❌ Unexpected response format:', data);
        return;
      }

      const rateRUB = data.rates.RUB;
      if (typeof rateRUB !== 'number') {
        console.error('❌ USD to RUB rate not found or invalid:', rateRUB);
        return;
      }

      const converted = amount * rateRUB;

      console.log('✅ FXRatesAPI is working');
      console.log(`💵 ${amount} USD = ${converted.toFixed(2)} RUB`);
      console.log(`📈 Rate: 1 USD = ${rateRUB} RUB`);
      if (data.date) console.log(`📅 Date: ${data.date}`);
      
      return {
        success: true,
        amount,
        converted: converted.toFixed(2),
        rate: rateRUB,
        date: data.date
      };
    } catch (err) {
      console.error('❌ Failed to fetch data from FXRatesAPI:', err.message);
      return { success: false, error: err.message };
    }
  }
}

module.exports = new CurrencyService();