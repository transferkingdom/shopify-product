import { getSSActivewearProduct } from '../../../../utils/ssactivewear';
import { updateShopifyProduct } from '../../../../utils/shopify';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const { id } = req.query;
    console.log('Gelen Style ID:', id);

    const product = await getSSActivewearProduct(id);
    
    // Shopify variant ID'lerini ekle
    product.variants = product.variants.map(variant => ({
      ...variant,
      id: variant.shopifyVariantId // Bu ID'yi Shopify'dan almalısınız
    }));

    res.status(200).json(product);
  } catch (error) {
    console.error('API Hatası:', error);
    res.status(500).json({ error: error.message });
  }
}