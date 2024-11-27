import { Shopify } from '@shopify/shopify-api';

export function verifyWebhook(body, hmac) {
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(body)
    .digest('base64');
  
  return hash === hmac;
}

export async function updateShopifyProduct(shop, id, ssProduct) {
  const client = new Shopify.Clients.Rest(shop, process.env.SHOPIFY_ACCESS_TOKEN);

  const productData = {
    product: {
      id: id,
      title: `${ssProduct.brand} ${ssProduct.styleName}`,
      vendor: 'SS Activewear',
      variants: ssProduct.variants.map(variant => ({
        option1: variant.colorName,
        price: variant.sizes[0].price,
        sku: variant.sizes[0].sku,
        inventory_quantity: variant.sizes[0].stock
      }))
    }
  };

  return await client.put({
    path: `products/${id}`,
    data: productData
  });
}