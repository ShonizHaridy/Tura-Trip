// utils/imageHelper.js
class ImageHelper {
  constructor() {
    this.baseImageUrl = `${process.env.API_BASE_URL || 'http://localhost:5000'}/uploads/`;
    
    // Image field configurations
    this.configs = {
      tour: { cover_image: 'cover_image_url' },
      city: { image: 'image_url' },
      review: {
        client_image: 'client_image_url',
        profile_image: 'profile_image_url', 
        screenshot_image: 'screenshot_image_url'
      }
    };
  }

  getImageUrl(filename) {
    if (!filename) return null;
    return `${this.baseImageUrl}${filename}`;
  }

  // Single generic process function
  processImages(item, type) {
    if (!item) return item;
    
    const config = this.configs[type];
    if (!config) return item;
    
    const processed = { ...item };
    
    Object.entries(config).forEach(([field, urlField]) => {
      if (item[field]) {
        processed[urlField] = this.getImageUrl(item[field]);
      }
    });
    
    return processed;
  }

  // Process arrays
  processArrayImages(items, type) {
    if (!Array.isArray(items)) return items;
    return items.map(item => this.processImages(item, type));
  }
}

module.exports = new ImageHelper();