const geoip = require('geoip-lite');

class CountryService {
  // Get country from IP address
  getCountryFromIP(ip) {
    try {
      // Handle localhost/development
      if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
          code: 'EG', // Default to Egypt since you're in Egypt
          name: 'Egypt',
          dialCode: '+20'
        };
      }

      const geo = geoip.lookup(ip);
      if (geo && geo.country) {
        const countryInfo = this.getCountryInfo(geo.country);
        return countryInfo;
      }
      
      // Fallback to Egypt
      return {
        code: 'EG',
        name: 'Egypt', 
        dialCode: '+20'
      };
    } catch (error) {
      console.error('Country detection error:', error);
      return {
        code: 'EG',
        name: 'Egypt',
        dialCode: '+20'
      };
    }
  }

  // Get country information by country code
  getCountryInfo(countryCode) {
    const countries = {
      'EG': { code: 'EG', name: 'Egypt', dialCode: '+20' },
      'US': { code: 'US', name: 'United States', dialCode: '+1' },
      'GB': { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
      'FR': { code: 'FR', name: 'France', dialCode: '+33' },
      'DE': { code: 'DE', name: 'Germany', dialCode: '+49' },
      'IT': { code: 'IT', name: 'Italy', dialCode: '+39' },
      'ES': { code: 'ES', name: 'Spain', dialCode: '+34' },
      'SA': { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
      'AE': { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
      'KW': { code: 'KW', name: 'Kuwait', dialCode: '+965' },
      'QA': { code: 'QA', name: 'Qatar', dialCode: '+974' },
      'BH': { code: 'BH', name: 'Bahrain', dialCode: '+973' },
      'OM': { code: 'OM', name: 'Oman', dialCode: '+968' },
      'JO': { code: 'JO', name: 'Jordan', dialCode: '+962' },
      'LB': { code: 'LB', name: 'Lebanon', dialCode: '+961' },
      'SY': { code: 'SY', name: 'Syria', dialCode: '+963' },
      'IQ': { code: 'IQ', name: 'Iraq', dialCode: '+964' },
      'LY': { code: 'LY', name: 'Libya', dialCode: '+218' },
      'SD': { code: 'SD', name: 'Sudan', dialCode: '+249' },
      'TN': { code: 'TN', name: 'Tunisia', dialCode: '+216' },
      'DZ': { code: 'DZ', name: 'Algeria', dialCode: '+213' },
      'MA': { code: 'MA', name: 'Morocco', dialCode: '+212' },
      'CA': { code: 'CA', name: 'Canada', dialCode: '+1' },
      'AU': { code: 'AU', name: 'Australia', dialCode: '+61' },
      'IN': { code: 'IN', name: 'India', dialCode: '+91' },
      'CN': { code: 'CN', name: 'China', dialCode: '+86' },
      'JP': { code: 'JP', name: 'Japan', dialCode: '+81' },
      'KR': { code: 'KR', name: 'South Korea', dialCode: '+82' },
      'BR': { code: 'BR', name: 'Brazil', dialCode: '+55' },
      'MX': { code: 'MX', name: 'Mexico', dialCode: '+52' },
      'RU': { code: 'RU', name: 'Russia', dialCode: '+7' },
      'TR': { code: 'TR', name: 'Turkey', dialCode: '+90' }
    };

    return countries[countryCode] || { code: 'EG', name: 'Egypt', dialCode: '+20' };
  }

  // Get all countries for dropdown
  getAllCountries() {
    return [
      { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
      { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
      { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
      { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
      { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
      { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
      { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
      { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
      { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
      { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
      { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
      { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
      { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
      { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
      { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
      { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
      { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
      { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
      { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
      { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
      { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
      { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
      { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' }
    ].sort((a, b) => a.name.localeCompare(b.name));
  }
}

module.exports = new CountryService();