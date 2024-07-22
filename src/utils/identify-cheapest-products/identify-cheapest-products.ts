import { Product } from "src/products";

export const identifyCheapestProducts = (products: Product[]) => {
    // Create a map to store the cheapest product for each ean code
    const eanMap = new Map();
  
    // Iterate over each product in the list
    products.forEach(product => {
      const { ean, price } = product;
  
      // If the ean code is already in the map, compare prices
      if (eanMap.has(ean)) {
        const existingProduct = eanMap.get(ean);
        // Update the map with the cheaper product
        if (price < existingProduct.price) {
          eanMap.set(ean, product);
        }
      } else {
        // If the ean code is not in the map, add the product to the map
        eanMap.set(ean, product);
      }
    });
  
    // Convert the map values to an array
    return Array.from(eanMap.values());
  }