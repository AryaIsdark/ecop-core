import *  as Shopify from 'shopify-api-node'
import { ShopifyConfig } from '../shopify-connector.service'

export const  initializeShopify = async(shopifyConfig: ShopifyConfig) : Promise<Shopify> => {
    const shopify = await new Shopify({
      shopName: shopifyConfig.storeId,
      accessToken: shopifyConfig.accessToken ?? '',
      apiVersion: '2024-07'
  })

  return shopify
}