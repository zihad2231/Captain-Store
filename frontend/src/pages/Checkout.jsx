import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-4">Shipping Address</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              {!user && <div className="alert alert-warning">Please log in to place an order.</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input 
                    type="text" 
                    name="address"
                    className="form-control" 
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      name="city"
                      className="form-control" 
                      value={shippingAddress.city}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      className="form-control" 
                      value={shippingAddress.postalCode}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    className="form-control" 
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 btn-lg"
                  disabled={!user}
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Order Summary</h5>
              <ul className="list-group list-group-flush mb-3">
                {cartItems.map(item => (
                  <li className="list-group-item d-flex justify-content-between lh-sm px-0" key={item.id}>
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <span className="text-muted">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="fs-5 fw-bold">Total</span>
                <strong className="fs-5 text-primary">৳ {getCartTotal().toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
