export default async function handler(req, res) {
    try {
      const order = req.body;
      
      // SS Activewear ürünlerini filtrele
      const ssItems = order.line_items.filter(item => 
        item.vendor === 'SS Activewear'
      );
  
      if (ssItems.length > 0) {
        // SS Activewear siparişi oluştur
        await createSSActivewearOrder(order, ssItems);
      }
  
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }