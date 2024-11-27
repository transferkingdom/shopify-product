export async function createSSActivewearOrder(shopifyOrder, items) {
    const auth = Buffer.from(
      `${process.env.SS_API_USERNAME}:${process.env.SS_API_KEY}`
    ).toString('base64');
  
    const orderData = {
      shippingMethod: "54", // Misc Cheapest
      shipBlind: true,
      emailConfirmation: "innovationsainc@gmail.com",
      testOrder: process.env.NODE_ENV === 'development',
      autoselectWarehouse: true,
      shippingAddress: {
        name: shopifyOrder.shipping_address.name,
        address1: shopifyOrder.shipping_address.address1,
        city: shopifyOrder.shipping_address.city,
        state: shopifyOrder.shipping_address.province_code,
        zip: shopifyOrder.shipping_address.zip,
        country: shopifyOrder.shipping_address.country_code
      },
      lines: items.map(item => ({
        identifier: item.sku,
        qty: item.quantity
      }))
    };
  
    const response = await fetch('https://api.ssactivewear.com/v2/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
  
    return await response.json();
  }