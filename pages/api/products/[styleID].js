export default async function handler(req, res) {
    const { styleID } = req.query;
  
    const SS_API_USERNAME = "507305";
    const SS_API_KEY = "3f2dd445-935d-42d8-81d3-391184e8c15d";
  
    try {
      const response = await fetch(
        `https://api.ssactivewear.com/v2/products/${styleID}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${SS_API_USERNAME}:${SS_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`SS Activewear API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // API yanıtını işle
      const processedData = {
        styleID: data.StyleID,
        styleName: data.StyleName,
        brandName: data.Brand,
        description: data.Description,
        colors: data.Colors || [],
        sizes: data.Sizes || [],
        price: data.Price,
        images: data.Images || []
      };
  
      res.status(200).json(processedData);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: error.message });
    }
  }