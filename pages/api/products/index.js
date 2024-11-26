import axios from 'axios';

export default async function handler(req, res) {
  try {
    const baseURL = 'https://api.ssactivewear.com/v2';
    const auth = Buffer.from(`${process.env.SS_API_USERNAME}:${process.env.SS_API_KEY}`).toString('base64');
    
    const productsResponse = await axios.get(`${baseURL}/products`, {
      params: {
        styleid: '372',
        limit: 100
      },
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    // Renklere göre grupla ve her renk için size/fiyat bilgilerini düzenle
    const groupedProducts = {};
    productsResponse.data.forEach(product => {
      if (!groupedProducts[product.colorName]) {
        groupedProducts[product.colorName] = {
          colorName: product.colorName,
          colorCode: product.colorCode,
          color1: product.color1,
          colorFrontImage: product.colorFrontImage,
          brandName: product.brandName,
          styleName: product.styleName,
          sizes: {}
        };
      }

      // Her size için fiyat ve stok bilgisini ekle
      groupedProducts[product.colorName].sizes[product.sizeName] = {
        size: product.sizeName,
        price: product.customerPrice,
        stock: product.warehouses.reduce((total, wh) => {
          // Dropship warehouse'ı hariç tut
          if (wh.warehouseAbbr !== 'DS') {
            return total + wh.qty;
          }
          return total;
        }, 0)
      };
    });

    // Objeyi array'e çevir
    const processedProducts = Object.values(groupedProducts);

    console.log('Processed products:', {
      totalColors: processedProducts.length,
      sampleProduct: processedProducts[0]
    });

    res.status(200).json(processedProducts);

  } catch (error) {
    console.error('API Error Details:', error);
    res.status(500).json({ 
      error: 'API request failed',
      message: error.message,
      details: error.response?.data
    });
  }
}