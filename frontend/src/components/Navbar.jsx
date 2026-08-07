import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for glass effect intensification
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = `navbar navbar-expand-lg sticky-top transition-all ${scrolled ? 'py-2 shadow-sm' : 'py-3'}`;

  return (
    <nav className={navClass} style={{ transition: 'all 0.3s ease' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="fs-3">⚓</span>
          <span>Captain Store</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto fw-medium">
            <li className="nav-item mx-1">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Explore</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item mx-1">
                <Link className="nav-link text-primary" to="/admin">Dashboard</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto align-items-center fw-medium gap-2">
            {user ? (
              <>
                <li className="nav-item d-none d-lg-block me-3">
                  <span className="text-muted small">Welcome back,</span> <strong className="text-dark">{user.name.split(' ')[0]}</strong>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-orders">Orders</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link text-muted" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm rounded-pill px-4 ms-2" to="/register">Create Account</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-danger btn-sm rounded-pill px-4 ms-2" to="/login">Admin Login</Link>
                </li>
              </>
            )}
            
            <li className="nav-item ms-lg-3 d-flex align-items-center border-start ps-lg-3 py-2 py-lg-0">
              <button 
                className="btn btn-outline-secondary border-0 rounded-circle p-2 d-flex align-items-center justify-content-center" 
                onClick={toggleTheme}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{ width: '40px', height: '40px' }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </li>
            
            <li className="nav-item ms-2">
              <Link className="btn btn-dark rounded-circle position-relative p-2 d-flex align-items-center justify-content-center shadow-sm" 
                    to="/cart" style={{ width: '45px', height: '45px', background: 'var(--brand-primary)' }}>
                🛒
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">
                    {cartCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
