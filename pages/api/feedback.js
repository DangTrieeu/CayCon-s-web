// pages/api/feedback.js
let feedbacks = [];
let feedbackId = 0;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, rating } = req.body;

  if (!name || !email || !message || !rating) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }

  const newFeedback = {
    id: ++feedbackId,
    name,
    email,
    message,  // Không exec message ở đây
    rating,
    timestamp: new Date().toISOString(),
  };
  feedbacks.push(newFeedback);

  res.status(200).json({ message: 'Gửi thành công', id: newFeedback.id });
}