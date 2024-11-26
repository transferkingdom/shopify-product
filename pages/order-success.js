import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderSuccess() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails(orderNumber);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async (orderNum) => {
    try {
      const response = await fetch(`/api/orders/${orderNum}`);
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Order Successful - SS Activewear</title>
      </Head>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Order Successful!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your order. Your order number is:
            </p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {orderNumber}
            </p>
          </div>

          {loading ? (
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading order details...</p>
            </div>
          ) : orderDetails ? (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Details
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {orderDetails.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Shipping Method
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {orderDetails.shippingMethod}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Shipping Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {orderDetails.shippingAddress.name}<br />
                      {orderDetails.shippingAddress.address1}<br />
                      {orderDetails.shippingAddress.address2 && (
                        <>{orderDetails.shippingAddress.address2}<br /></>
                      )}
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : null}

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/orders')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View All Orders
            </button>
            <button
              onClick={() => router.push('/')}
              className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}