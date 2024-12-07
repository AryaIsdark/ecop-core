import axios from 'axios';
import { Product } from 'src/products';


export interface WebApiSyncConfiguration {
  feed_url: string;
  authorization: string;
  responsePath?: string;
  productMappingKeys: Record<string, string>;
}

export async function readWebApiFeed(feed_url: string, authorization: string, responsePath: string, productMappingKeys:  Record<string, string> ): Promise<Product[]> {
  try {
    // Fetch the data from the web API
    const response = await axios.get(feed_url, {headers: {Authorization: authorization}}) ;
    let rawData = response.data;

    // Navigate to the response path if specified
    if (responsePath) {
      rawData = getNestedValue(rawData, responsePath, []);
    }

    // Ensure rawData is an array
    if (!Array.isArray(rawData)) {
      throw new Error('The response data must be an array or resolve to an array.');
    }

    // Map the data according to the productMappingKeys and cast it to Product
    const mappedProducts: Product[] = rawData.map((item: any) => {
      const mappedItem: Partial<Product> = {};
      for (const [mappedKey, originalKey] of Object.entries(productMappingKeys)) {
        mappedItem[mappedKey] = originalKey ? getNestedValue(item, originalKey, null) : null;
      }
      // Cast the mapped item to the Product entity
      return Object.assign(new Product(), mappedItem) as Product;
    });

    return mappedProducts;
  } catch (error) {
    console.error('Error fetching or mapping product data:', error);
    throw error;
  }
}

// Helper function to safely access nested properties
function getNestedValue(obj: any, path: string, defaultValue: any = null): any {
  if (!path) return defaultValue;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
}