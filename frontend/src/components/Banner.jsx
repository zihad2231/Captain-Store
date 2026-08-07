import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerText, setBannerText] = useState('Special Offer: Free Shipping!');

  useEffect(() => {
    const fetchBanner = async () => {
      const settings = await getSettings();
      if (settings && settings.bannerText) {
        setBannerText(settings.bannerText);
      }
    };
    fetchBanner();
  }, []);

  if (!isVisible || !bannerText) return null;

  return (
    <div className="bg-primary text-white text-center py-2 position-relative" style={{ zIndex: 1000 }}>
      <div className="container">
        <span className="fw-medium">{bannerText}</span>
        <button 
          onClick={() => setIsVisible(false)} 
          className="btn-close btn-close-white position-absolute top-50 end-0 translate-middle-y me-3" 
          aria-label="Close"
          style={{ fontSize: '0.75rem' }}
        ></button>
      </div>
    </div>
  );
};

export default Banner;
