import axios from 'axios';
import { Product } from 'src/products';
import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';

interface MappingKeys {
  [key: string]: string;
}

export const normalizePrice = (price: string | number) => {
  if (typeof price === 'number') return price;
  return Number(price.replace(',', '.').trim());
};

/** Parses a weight value and returns kg. Defaults to grams input. */
export const normalizeWeight = (
  weight: string | number,
  unit: 'g' | 'kg' = 'g',
) => {
  const value =
    typeof weight === 'number'
      ? weight
      : Number(weight.replace(',', '.').trim());
  return unit === 'g' ? value / 1000 : value;
};

/**
 * Attempts to extract a weight in kg from a freeform size string.
 *
 * Handles grams ("500 g", "500g", "500 gram", "500 grams") and kilograms
 * ("1.5 kg", "1,5kg"). Returns null when no weight unit is detected (e.g.
 * "10 servings", "10 packs").
 */
export const weightFromSize = (size: string): number | null => {
  if (!size) return null;
  const normalised = size.replace(',', '.').trim();

  const gramsMatch = normalised.match(/^(\d+(?:\.\d+)?)\s*g(?:rams?)?\s*$/i);
  if (gramsMatch) return Number(gramsMatch[1]) / 1000;

  const kgMatch = normalised.match(/^(\d+(?:\.\d+)?)\s*kg\s*$/i);
  if (kgMatch) return Number(kgMatch[1]);

  return null;
};

export async function getProductsFromXML(
  url: string,
  initialNode: string,
  mappingKeys: MappingKeys,
): Promise<Partial<Product>[]> {
  try {
    // Fetch the XML content from the URL
    const response = await axios.get(url, { responseType: 'text' });
    const xmlString = response.data;

    // Parse the XML string using xmldom
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // Function to get text content by XPath and trim it
    function getTextContentByXPath(
      xpathExpr: string,
      contextNode: Node,
    ): string {
      const nodes = xpath.select(xpathExpr, contextNode) as Node[];
      return nodes.length > 0 ? nodes[0].textContent?.trim() || '' : '';
    }

    // Extract all product nodes
    const products = xpath.select(`//${initialNode}`, xmlDoc) as Node[];
    const productArray: Partial<Product>[] = [];

    for (const productNode of products) {
      const product: Partial<Product> = {};

      // Iterate over the config and map the keys
      for (const key in mappingKeys) {
        if (mappingKeys.hasOwnProperty(key)) {
          const xpathExpr = mappingKeys[key];
          product[key] = getTextContentByXPath(xpathExpr, productNode);
        }
      }

      // Ensure all values are trimmed
      Object.keys(product).forEach((key) => {
        if (typeof product[key] === 'string') {
          product[key] = (product[key] as string).trim();
        }
      });

      productArray.push({ ...product });
    }

    return productArray;
  } catch (error) {
    console.error('Error fetching or processing XML:', error);
    throw error;
  }
}
