import * as path from 'path';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios from 'axios';

import { initializeShopify } from './initialize-shopify';
import { ShopifyConfig } from '../shopify-connector.service';

export const uploadFileToShopify = async (
  shopifyConfig: ShopifyConfig,
  fileName: string,
  fileSize: number,
) => {
  const shopify = await initializeShopify(shopifyConfig);
  const mutation = `
          mutation {
            stagedUploadsCreate(input: {
                fileSize: "${fileSize}" 
                httpMethod: POST 
                mimeType: "text/jsonl" 
                filename: "${fileName}" 
                resource: BULK_MUTATION_VARIABLES 
            }) {
              stagedTargets {
                url
                resourceUrl
                parameters {
                  name
                  value
                }
              }
            }
          }
        `;

  const response = await shopify.graphql(mutation, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { url, parameters, resourceUrl } =
    response.stagedUploadsCreate.stagedTargets[0];
  let uploadUrl = '';
  const formData = new FormData();
  parameters.forEach((param: any) => {
    formData.append(param.name, param.value);
    if (param.name === 'key') {
      uploadUrl = resourceUrl + param.value;
    }
  });

  const rootFolder = process.cwd();

  const filePath = path.join(rootFolder, fileName);
  const file = fs.createReadStream(filePath);

  formData.append('file', file);

  try {
    const uploadResponse = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Shopify-Access-Token': shopifyConfig.accessToken ?? '',
      },
    });
    if (!uploadResponse.data) {
      const error = await uploadResponse.data;
      throw new Error('File upload failed');
    }

    return { url, resourceUrl, uploadUrl };
  } catch (e) {
    console.error(e);
  }

  return { url, resourceUrl, uploadUrl };
};
