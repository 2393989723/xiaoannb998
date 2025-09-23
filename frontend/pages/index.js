import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products');
        setProducts(data);
      } catch (error) {
        toast.error('获取商品失败');
      }
    };
    
    fetchProducts();
  }, []);

  const handlePurchase = async () => {
    try {
      await api.post('/orders', {
        productId: selectedProduct._id,
        paymentMethod,
        contactInfo
      });
      toast.success('订单已提交，请联系客服完成支付');
      setSelectedProduct(null);
    } catch (error) {
      toast.error('下单失败');
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">账号购买平台</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">钻石: {user.diamonds}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">¥{product.price}</span>
                  <span className="text-blue-500">{product.diamonds}钻石</span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  购买
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 购买模态框 */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">购买 {selectedProduct.name}</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">支付方式</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">选择支付方式</option>
                  <option value="支付宝">支付宝</option>
                  <option value="微信">微信</option>
                  <option value="银行卡">银行卡</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">联系方式</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="QQ/微信/手机号"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  onClick={handlePurchase}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  提交订单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
