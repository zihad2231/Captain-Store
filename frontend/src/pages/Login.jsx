import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await loginUser({ email, password });
      if (user) {
        login(user);
        navigate('/');
      } else {
        setError('Invalid username/email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container w-100">
      <div className="auth-card">
        <div className="glass-panel p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Welcome Back</h2>
            <p className="text-muted">Sign in to access your premium account</p>
          </div>
          
          {error && <div className="alert alert-danger py-2 px-3 small">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Email or Username</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required 
              />
            </div>
            <div className="mb-5">
              <div className="d-flex justify-content-between">
                <label className="form-label">Password</label>
                <Link to="#" className="text-muted small text-decoration-none hover-primary">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-100 shadow-md mb-4" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="text-center mt-3 border-top pt-4">
            <p className="text-muted mb-3">
              New to NexCart? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create an account</Link>
            </p>
            <button 
              type="button"
              className="btn btn-outline-dark btn-sm rounded-pill px-4"
              onClick={() => {
                setEmail('zihad');
                setPassword('123456');
              }}
            >
              <i className="bi bi-shield-lock me-1"></i> Quick Admin Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
