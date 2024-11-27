import { getSSActivewearProduct } from '../../../../utils/ssactivewear';
import { updateShopifyProduct } from '../../../../utils/shopify';

export default async function handler(req, res) {
  const { id } = req.query;
  const shop = req.headers['x-shopify-shop-domain'];

  try {
    // SS Activewear'dan ürün bilgilerini al
    const ssProduct = await getSSActivewearProduct(id);
    
    // Shopify ürününü güncelle
    if (req.method === 'POST') {
      await updateShopifyProduct(shop, id, ssProduct);
    }

    res.status(200).json(ssProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}