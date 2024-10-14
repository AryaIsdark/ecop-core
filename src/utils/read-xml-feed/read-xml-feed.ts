import axios from 'axios';
import { Product } from 'src/products';
import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';

interface MappingKeys {
  [key: string]: string;
}

// interface Product {
//   [key: string]: string;
// }

export const getPrice = (discountInPercentage: number, originalPrice: number) => {
  if (!discountInPercentage) {
    return originalPrice
  }

  const discount = (originalPrice * discountInPercentage) / 100

  return originalPrice - discount
}

export async function getProductsFromXML(url: string, initialNode: string, mappingKeys: MappingKeys, discountInPercentage: number): Promise<Partial<Product>[]> {
  try {
    // Fetch the XML content from the URL
    const response = await axios.get(url, { responseType: 'text' });
    const xmlString = response.data;

    // Parse the XML string using xmldom
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Function to get text content by XPath
    function getTextContentByXPath(xpathExpr: string, contextNode: Node): string {
      const nodes = xpath.select(xpathExpr, contextNode) as Node[];
      return nodes.length > 0 ? nodes[0].textContent || '' : '';
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

      productArray.push({ ...product, price: getPrice(discountInPercentage, product.price)  });
    }

    return productArray;
  } catch (error) {
    console.error("Error fetching or processing XML:", error);
    throw error;
  }
}