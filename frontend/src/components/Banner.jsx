import { useState } from 'react';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-dark text-light py-2 px-4 d-flex justify-content-between align-items-center">
      <div className="d-flex w-100 justify-content-center align-items-center text-center">
        <span className="fw-bold me-2">SPECIAL OFFER:</span> 
        <span>Get 20% off all Premium Watches! Use code <span className="text-warning fw-bold">CAPTAIN20</span></span>
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
