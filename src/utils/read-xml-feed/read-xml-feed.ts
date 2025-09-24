import axios from 'axios';
import * as https from 'https';
import { Product } from 'src/products';
import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';

interface MappingKeys {
  [key: string]: string;
}

export const normalizePrice = (price: string) => {
  return Number(price.replace(',', '.').trim());
};

export const getPrice = (
  discountInPercentage: number,
  originalPrice: number,
) => {
  if (!discountInPercentage) {
    return originalPrice;
  }

  const discount = (originalPrice * discountInPercentage) / 100;
  const finalPrice = originalPrice - discount;

  return finalPrice || originalPrice;
};

export async function getProductsFromXML(
  url: string,
  initialNode: string,
  mappingKeys: MappingKeys,
  discountInPercentage: number,
): Promise<Partial<Product>[]> {
  try {
    // temporarily disable ssl
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    // Fetch the XML content from the URL
    const response = await axios.get(url, {
      httpsAgent: agent,
      responseType: 'text',
    });

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

      productArray.push({
        ...product,
        price: getPrice(
          discountInPercentage,
          normalizePrice(product.price as unknown as string),
        ),
      });
    }

    return productArray;
  } catch (error) {
    console.error('Error fetching or processing XML:', error);
    throw error;
  }
}
