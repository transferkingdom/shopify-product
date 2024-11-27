// SS Activewear API işlemleri için yardımcı fonksiyonlar
export async function getSSActivewearProduct(styleId) {
    const auth = Buffer.from(
      `${process.env.SS_API_USERNAME}:${process.env.SS_API_KEY}`
    ).toString('base64');
  
    const response = await fetch(
      `https://api.ssactivewear.com/v2/products/?style=${styleId}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );
  
    if (!response.ok) {
      throw new Error('SS Activewear API hatası');
    }
  
    const products = await response.json();
    
    // Renk ve beden varyantlarını grupla
    const variants = products.reduce((acc, product) => {
      const colorKey = `${product.colorName}-${product.colorCode}`;
      
      if (!acc[colorKey]) {
        acc[colorKey] = {
          colorName: product.colorName,
          colorCode: product.colorCode,
          colorHex: product.color1,
          images: {
            front: product.colorFrontImage,
            back: product.colorBackImage,
            swatch: product.colorSwatchImage
          },
          sizes: []
        };
      }
  
      acc[colorKey].sizes.push({
        size: product.sizeName,
        sku: product.sku,
        price: product.customerPrice,
        stock: product.qty
      });
  
      return acc;
    }, {});
  
    return {
      styleId: products[0].styleID,
      styleName: products[0].styleName,
      brand: products[0].brandName,
      variants: Object.values(variants)
    };
  }