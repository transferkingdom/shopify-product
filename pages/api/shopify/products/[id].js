import { getSSActivewearProduct } from '../../../../utils/ssactivewear';
import { updateShopifyProduct } from '../../../../utils/shopify';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { id } = req.query;
    
    // ID kontrolü
    if (!id || id === '{' || id === '%7B') {
      throw new Error('Geçersiz Style ID');
    }

    console.log('Gelen Style ID:', id);

    const ssProduct = await getSSActivewearProduct(id);
    
    // Veri kontrolü
    if (!ssProduct || !ssProduct.variants) {
      throw new Error('Ürün verileri alınamadı');
    }

    res.status(200).json(ssProduct);
  } catch (error) {
    console.error('API Hatası:', error);
    res.status(500).json({ 
      error: error.message || 'SS Activewear API hatası',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}