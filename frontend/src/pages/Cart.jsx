import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      alert("Please log in to checkout.");
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>
      
      <div className="row">
        <div className="col-md-8">
          <ul className="list-group mb-3 shadow-sm border-0">
            {cartItems.map(item => (
              <li className="list-group-item d-flex justify-content-between align-items-center p-4" key={item.id}>
                <div className="d-flex flex-column w-50">
                  <h5 className="my-0 fw-bold text-truncate">{item.name}</h5>
                  <small className="text-muted">৳ {item.price.toLocaleString('en-IN')} each</small>
                </div>
                
                <div className="d-flex align-items-center justify-content-between w-50">
                  <div className="input-group input-group-sm" style={{ width: '120px' }}>
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >-</button>
                    <input 
                      type="text" 
                      className="form-control text-center bg-white" 
                      value={item.quantity} 
                      readOnly 
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => addToCart(item)}
                    >+</button>
                  </div>
                  
                  <span className="fw-bold ms-3">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  
                  <button 
                    className="btn btn-sm text-danger ms-3"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <strong>৳ {getCartTotal().toLocaleString('en-IN')}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total</span>
                <strong className="fs-5 text-primary">৳ {getCartTotal().toLocaleString('en-IN')}</strong>
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-2 btn-lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
