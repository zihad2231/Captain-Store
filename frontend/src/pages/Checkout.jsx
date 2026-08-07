import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/api';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to checkout.');
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user.id,
        orderItems: cartItems,
        shippingAddress,
        totalPrice: getCartTotal()
      };

      const newOrder = await createOrder(orderData);
      if (newOrder) {
        clearCart();
        navigate('/my-orders');
      } else {
        setError('Error placing the order. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel p-5 d-inline-block mt-5">
          <h2 className="mb-4">Your cart is empty</h2>
          <Link to="/" className="btn btn-primary px-4">Return to Shop</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel p-5 d-inline-block mt-5">
          <h2 className="mb-4">Authentication Required</h2>
          <p className="text-muted mb-4">Please log in or register to proceed with your order.</p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/login" className="btn btn-primary px-4">Log In</Link>
            <Link to="/register" className="btn btn-outline-secondary px-4">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/cart" className="text-muted text-decoration-none hover-primary">
          &larr; Back to Cart
        </Link>
      </div>
      
      <h2 className="fw-bold mb-4">Secure Checkout</h2>
      
      <div className="row g-5">
        <div className="col-lg-7">
          <div className="glass-panel p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-4 pb-2 border-bottom">1. Shipping Address</h4>
            
            {error && <div className="alert alert-danger py-2 px-3 small mb-4">{error}</div>}
            
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  className="form-control form-control-lg" 
                  value={shippingAddress.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St, Apt 4B"
                  required 
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">City</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-control form-control-lg" 
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="e.g. Dhaka"
                    required 
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">Postal Code</label>
                  <input 
                    type="text" 
                    name="postalCode"
                    className="form-control form-control-lg" 
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 1205"
                    required 
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold">Country</label>
                <input 
                  type="text" 
                  name="country"
                  className="form-control form-control-lg" 
                  value={shippingAddress.country}
                  onChange={handleChange}
                  placeholder="e.g. Bangladesh"
                  required 
                />
              </div>
            </form>
          </div>
          
          <div className="glass-panel p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-4 pb-2 border-bottom">2. Payment Method</h4>
            <div className="p-4 border rounded bg-light text-center">
              <p className="mb-0 text-muted">For this demo, Cash on Delivery (COD) is selected by default.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-panel p-4 sticky-top" style={{ top: '100px' }}>
            <h4 className="fw-bold mb-4 pb-2 border-bottom">Order Summary</h4>
            
            <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <ul className="list-group list-group-flush">
                {cartItems.map(item => (
                  <li className="list-group-item bg-transparent px-0 d-flex justify-content-between align-items-start border-0 mb-3" key={item.id}>
                    <div className="d-flex gap-3">
                      <div className="rounded border bg-white flex-shrink-0" style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
                        <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div>
                        <h6 className="my-0 fw-bold small text-truncate" style={{ maxWidth: '180px' }}>{item.name}</h6>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-bold small mt-1">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-light p-3 rounded mb-4">
              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Subtotal</span>
                <span>৳ {getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-muted">
                <span>Shipping</span>
                <span>৳ 0</span>
              </div>
              <div className="d-flex justify-content-between pt-2 border-top">
                <span className="fw-bold">Total To Pay</span>
                <strong className="fs-5 price-tag">৳ {getCartTotal().toLocaleString('en-IN')}</strong>
              </div>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              className="btn btn-primary w-100 btn-lg shadow-md"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>
            
            <div className="text-center mt-3 small text-muted">
              <i className="bi bi-shield-lock me-1"></i> Secure Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
