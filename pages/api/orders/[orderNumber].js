export default async function handler(req, res) {
    const { orderNumber } = req.query;
    const SS_API_USERNAME = "507305";
    const SS_API_KEY = "3f2dd445-935d-42d8-81d3-391184e8c15d";
  
    try {
      const response = await fetch(
        `https://api.ssactivewear.com/v2/orders/${orderNumber}`,
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
      res.status(200).json(data);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: error.message });
    }
  }