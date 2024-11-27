export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { orderData, customerAddress } = req.body;
  
    try {
      const ssOrder = {
        shippingAddress: {
          customer: customerAddress.name,
          attn: customerAddress.name,
          address: customerAddress.address1,
          city: customerAddress.city,
          state: customerAddress.province_code,
          zip: customerAddress.zip,
          residential: true
        },
        shippingMethod: "54", // Misc Cheapest
        shipBlind: true,
        poNumber: orderData.order_number,
        emailConfirmation: "innovationsainc@gmail.com",
        testOrder: process.env.NODE_ENV === 'development',
        autoselectWarehouse: true,
        lines: orderData.line_items.map(item => ({
          identifier: item.sku, // SS Activewear Style ID
          qty: item.quantity
        }))
      };
  
      const response = await fetch('https://api.ssactivewear.com/v2/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SS_API_USERNAME}:${process.env.SS_API_KEY}`
          ).toString('base64')}`
        },
        body: JSON.stringify(ssOrder)
      });
  
      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }