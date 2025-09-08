import { createPaymentUrl } from '../../lib/vnpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, amount, orderInfo } = req.body;

  try {
    const paymentUrl = await createPaymentUrl(orderId, amount, orderInfo, req.headers['x-forwarded-for'] || '127.0.0.1');
    res.status(200).json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}