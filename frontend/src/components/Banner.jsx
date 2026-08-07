import { useState, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { bannerText } = useContext(SettingsContext);

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
