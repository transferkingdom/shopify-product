import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import OrderForm from '../../components/OrderForm';

export default function ProductDetail() {
  const router = useRouter();
  const { styleID } = router.query;
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  // Ürün detaylarını getir
  const fetchProductDetails = async () => {
    if (!styleID) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${styleID}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProduct(data);
      // Varsayılan renk ve beden seç
      if (data.colors.length > 0) setSelectedColor(data.colors[0].ColorCode);
      if (data.sizes.length > 0) setSelectedSize(data.sizes[0].SizeName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sipariş oluştur
  const handleOrder = async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Başarılı sipariş sonrası yönlendirme
      router.push({
        pathname: '/order-success',
        query: { orderNumber: data.orderNumber }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{product ? `${product.brandName} - ${product.styleName}` : 'Product Detail'}</title>
      </Head>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        ) : product ? (
          <OrderForm
            product={product}
            selectedOptions={{
              selectedColor,
              selectedSize,
              quantity
            }}
            onSubmit={handleOrder}
          />
        ) : null}
      </main>
    </div>
  );
}