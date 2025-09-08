import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';
import { convertUSDToVND } from '../lib/utils';

const Product = ({ product: { image, name, slug, price } }) => {
  const priceInVND = convertUSDToVND(price);
  
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <img 
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="product-image"
          />
          <p className="product-name">{name}</p>
          <div className="price-container">
            <p className="product-price">${price}</p>
            <p className="product-price-vnd">{priceInVND.toLocaleString('vi-VN')}₫</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Product