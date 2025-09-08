import querystring from 'qs';
import crypto from 'crypto';
import moment from 'moment';
import vnpayConfig from '../vnpay/config/vnpay.config';

export const createPaymentUrl = async (orderId, amount, orderInfo) => {
  try {
    const tmnCode = vnpayConfig.vnp_TmnCode;
    const secretKey = vnpayConfig.vnp_HashSecret;
    const createDate = moment().format('YYYYMMDDHHmmss');

    // Đảm bảo amount là số nguyên
    const vnpAmount = Math.floor(amount) * 100;
    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    console.log('Raw VNP Params:', vnpParams);

    // Sắp xếp tham số và tạo chuỗi query
    const sortedParams = sortObject(vnpParams);
    console.log('Sorted VNP Params:', sortedParams);

    const signData = querystring.stringify(sortedParams, { encode: false });
    console.log('Sign Data:', signData);

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    console.log('Generated Signature:', signed);

    // Thêm chữ ký vào params
    const finalParams = { ...sortedParams, vnp_SecureHash: signed };
    console.log('Final Params with Signature:', finalParams);

    // Tạo URL thanh toán với tham số đã sắp xếp
    const paymentUrl = `${vnpayConfig.vnp_Url}?${querystring.stringify(finalParams, { encode: false })}`;
    console.log('Payment URL:', paymentUrl);

    return paymentUrl;
  } catch (error) {
    console.error('Error creating payment URL:', error);
    throw error;
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}