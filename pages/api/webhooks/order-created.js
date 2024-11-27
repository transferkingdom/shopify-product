import { verifyWebhook } from '../../../utils/shopify';

export default async function handler(req, res) {
  try {
    // Webhook doğrulama
    const hmac = req.headers['x-shopify-hmac-sha256'];
    const verified = verifyWebhook(req.body, hmac);
    
    if (!verified) {
      return res.status(401).json({ error: 'Invalid webhook' });
    }

    const order = JSON.parse(req.body);

    // SS Activewear ürünlerini filtrele
    const ssItems = order.line_items.filter(item => 
      item.vendor === 'SS Activewear'
    );

    if (ssItems.length > 0) {
      // SS Activewear siparişi oluştur
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderData: order,
          customerAddress: order.shipping_address
        })
      });
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
}