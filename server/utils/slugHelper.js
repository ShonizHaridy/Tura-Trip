// utils/slugHelper.js
class SlugHelper {
  // Generate URL-friendly slug from string
  static generateSlug(text) {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .trim()
      // Handle accented characters
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace spaces and special chars with hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
  }

  // Generate city-ID slug combination
  static generateCitySlug(cityId, cityName) {
    const slug = this.generateSlug(cityName);
    return `${cityId}-${slug}`;
  }

  // Parse city-ID slug combination
  static parseCitySlug(citySlug) {
    if (!citySlug) return null;
    
    const match = citySlug.match(/^(\d+)-(.+)$/);
    if (!match) {
      // Fallback: treat as city name for backward compatibility
      return { id: null, slug: citySlug, originalName: citySlug };
    }
    
    return {
      id: parseInt(match[1]),
      slug: match[2],
      originalSlug: citySlug
    };
  }

  // Validate if a slug matches a city name
  static validateCitySlug(inputSlug, actualCityName) {
    const generatedSlug = this.generateSlug(actualCityName);
    const inputSlugClean = this.generateSlug(inputSlug);
    return generatedSlug === inputSlugClean;
  }
}

module.exports = SlugHelper;