import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await registerUser(formData);
      if (user) {
        login(user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container w-100">
      <div className="auth-card">
        <div className="glass-panel p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-muted">Join the premium shopping experience</p>
          </div>
          
          {error && <div className="alert alert-danger py-2 px-3 small">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name"
                className="form-control form-control-lg" 
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email"
                className="form-control form-control-lg" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                name="password"
                className="form-control form-control-lg" 
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-100 shadow-md mb-4 mt-2" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          
          <div className="text-center mt-3 border-top pt-4">
            <p className="text-muted mb-0">
              Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
