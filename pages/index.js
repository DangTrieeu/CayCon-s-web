import React from 'react';

import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner, Feedback } from '../components';

const Home = ({ products, bannerData }) => (
  <div>
    <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
    
    <div className="products-heading">
      <h2>Sản phẩm nổi bật</h2>
      <p>Khám phá bộ sưu tập sản phẩm chất lượng cao của chúng tôi</p>
    </div>

    <div className="featured-products">
      <div className="products-container">
        {products?.map((product) => <Product key={product._id} product={product} />)}
      </div>
    </div>

    <div className="about-section">
      <div className="about-content">
        <h2>Về chúng tôi</h2>
        <p>Chúng tôi cung cấp những sản phẩm chất lượng cao với giá cả hợp lý. Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi.</p>
        <a href="https://www.youtube.com/watch?v=IzSYlr3VI1A&list=RDIzSYlr3VI1A&start_radio=1" className="about-btn">Tìm hiểu thêm</a>
      </div>
      <div className="about-image">
      <img src="https://www.invert.vn/media/uploads/uploads/2022/12/07224530-2.jpeg" alt="About Us" width="300" />

      </div>
    </div>

    <Feedback />

    <FooterBanner footerBanner={bannerData && bannerData[0]} />
  </div>
);

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  }
}

export default Home;
