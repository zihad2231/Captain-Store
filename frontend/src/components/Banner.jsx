import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerText, setBannerText] = useState('SPECIAL OFFER: Get 20% off all Premium Watches! Use code CAPTAIN20');

  useEffect(() => {
    const fetchBanner = async () => {
      const settings = await getSettings();
      if (settings && settings.bannerText) {
        setBannerText(settings.bannerText);
      }
    };
    fetchBanner();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-dark text-light py-2 px-4 d-flex justify-content-between align-items-center">
      <div className="d-flex w-100 justify-content-center align-items-center text-center">
        <span>{bannerText}</span>
      </div>
      <button 
        className="btn-close btn-close-white" 
        onClick={() => setIsVisible(false)}
        aria-label="Close"
      ></button>
    </div>
  );
};

export default Banner;
