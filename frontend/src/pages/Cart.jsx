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
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel p-5 d-inline-block mt-5">
          <div className="display-1 mb-3">🛒</div>
          <h2 className="mb-3 fw-bold">Your cart is empty</h2>
          <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary btn-lg px-5 shadow-sm">Explore Collection</Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <h1 className="mb-5 fw-bold">Your Shopping Cart</h1>
      
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="glass-panel p-0 overflow-hidden">
            <ul className="list-group list-group-flush border-0">
              {cartItems.map((item, index) => (
                <li className={`list-group-item cart-item p-4 border-0 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`} key={item.id} style={{ borderColor: 'var(--brand-border) !important' }}>
                  <div className="row align-items-center">
                    {/* Item Info */}
                    <div className="col-md-5 d-flex align-items-center gap-3 mb-3 mb-md-0">
                      <div className="rounded overflow-hidden bg-white shadow-sm" style={{ width: '80px', height: '80px' }}>
                        <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="img-fluid w-100 h-100 object-fit-cover" />
                      </div>
                      <div>
                        <h5 className="mb-1 fw-bold text-truncate" style={{ maxWidth: '200px' }} title={item.name}>
                          <Link to={`/product/${item.id}`} className="text-decoration-none text-reset">{item.name}</Link>
                        </h5>
                        <small className="text-muted">৳ {item.price.toLocaleString('en-IN')}</small>
                      </div>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="col-md-4 d-flex justify-content-md-center mb-3 mb-md-0">
                      <div className="d-flex align-items-center bg-light rounded-pill p-1 border">
                        <button className="quantity-btn border-0" onClick={() => decreaseQuantity(item.id)}>-</button>
                        <span className="fw-bold px-4">{item.quantity}</span>
                        <button className="quantity-btn border-0" onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="col-md-3 d-flex justify-content-between justify-content-md-end align-items-center">
                      <span className="fw-bold fs-5 me-md-3">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      <button 
                        className="btn btn-sm btn-outline-danger border-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '36px', height: '36px' }}
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '100px' }}>
            <h4 className="fw-bold mb-4 border-bottom pb-3">Order Summary</h4>
            
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>৳ {getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Shipping Estimate</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="d-flex justify-content-between mb-4 pt-3 border-top mt-3">
              <span className="fs-5 fw-bold">Total</span>
              <strong className="fs-4 price-tag">৳ {getCartTotal().toLocaleString('en-IN')}</strong>
            </div>
            
            <button 
              className="btn btn-primary w-100 mb-3 btn-lg shadow-sm"
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
            
            {!user && (
              <div className="alert alert-light border mt-4 small text-center p-2 mb-0">
                You will be asked to sign in before checking out.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
