import React, { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const USD_TO_VND_RATE = 24650;

const Cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);

  const totalVND = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      if (!item.price || !item.quantity) return total;
      return total + Math.round(item.price * USD_TO_VND_RATE) * item.quantity;
    }, 0);
  }, [cartItems]);

  const convertToVND = (usdPrice) => {
    if (!usdPrice || typeof usdPrice !== 'number') return 0;
    return Math.round(usdPrice * USD_TO_VND_RATE);
  };

  const handleCheckout = async () => {
    if (isLoading) return;
    if (!cartItems || cartItems.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm!');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Đang chuyển hướng đến trang thanh toán...');

    try {
      const orderId = `ORDER_${Date.now()}`;
      const orderInfo = `Payment for order ${orderId}`; // Thay chuỗi không dấu

      console.log('Calling /api/vnpay with:', { orderId, amount: totalVND, orderInfo });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://trieungu.io.vn'}/api/vnpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: totalVND, orderInfo }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server trả về dữ liệu không phải JSON');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể tạo URL thanh toán');
      }

      if (data.paymentUrl) {
        console.log('Payment URL:', data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('URL thanh toán không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error.message);
      toast.error(`Lỗi: ${error.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
          disabled={isLoading}
        >
          <AiOutlineLeft />
          <span className="heading">Giỏ hàng</span>
          <span className="cart-num-items">({totalQuantities} sản phẩm)</span>
        </button>

        {(!cartItems || cartItems.length < 1) && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Giỏ hàng của bạn đang trống</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
                disabled={isLoading}
              >
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        )}

        {cartItems?.length >= 1 && (
          <div className="product-container">
            {cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image?.[0])}
                  className="cart-product-image"
                  alt={item.name}
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <div className="price-display">
                      <h4>${item.price?.toFixed(2)}</h4>
                      <h4>{convertToVND(item.price).toLocaleString('vi-VN')} ₫</h4>
                    </div>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() => !isLoading && toggleCartItemQuanitity(item._id, 'dec')}
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() => !isLoading && toggleCartItemQuanitity(item._id, 'inc')}
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => !isLoading && onRemove(item)}
                      disabled={isLoading}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems?.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Tổng tiền:</h3>
              <div className="total-price">
                <h3>${totalPrice?.toFixed(2)}</h3>
                <h3>{totalVND.toLocaleString('vi-VN')} ₫</h3>
              </div>
            </div>
            <div className="btn-container">
              <button
                type="button"
                className="btn"
                onClick={handleCheckout}
                disabled={isLoading || totalVND === 0}
              >
                Thanh toán với VNPAY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
