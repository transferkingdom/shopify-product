document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.ssactivewear-product');
    if (!container) return;
  
    const styleId = container.dataset.styleId;
    if (!styleId) {
      console.error('Style ID bulunamadı');
      return;
    }
  
    console.log('Style ID:', styleId);
  
    // Ürün verilerini getir
    fetch(`/apps/ssactivewear/products/${styleId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Ürün verileri:', data);
        // Ürün verilerini göster
        renderProduct(data);
      })
      .catch(error => {
        console.error('Veri getirme hatası:', error);
      });
  });