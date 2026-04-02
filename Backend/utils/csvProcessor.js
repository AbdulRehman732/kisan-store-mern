const csv = require('csv-parser');
const fs = require('fs');

/**
 * Parses a CSV file and returns an array of product objects
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} - Array of parsed products
 */
const parseProductsCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Map and validate CSV fields to Product model
        const product = {
          name: data.name?.trim(),
          price: parseFloat(data.price),
          taxAmount: parseFloat(data.taxAmount || 0),
          stock: parseInt(data.stock || 0, 10),
          brand: data.brand?.trim(),
          category: data.category?.trim(),
          description: data.description?.trim(),
          unit: data.unit?.trim() || 'per bag',
          isAvailable: (data.isAvailable?.toLowerCase() === 'true' || data.stock > 0),
          featured: data.featured?.toLowerCase() === 'true',
          crops: data.crops ? data.crops.split(',').map(c => c.trim()) : [],
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
          image: data.image ? data.image.split(',').map(i => i.trim()) : []
        };

        // Basic validation
        if (product.name && !isNaN(product.price) && product.category) {
          results.push(product);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

module.exports = { parseProductsCsv };
