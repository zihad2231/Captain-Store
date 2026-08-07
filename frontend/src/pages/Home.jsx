import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    setFilteredProducts(result);
  }, [search, category, products]);

  // Extract unique categories for the dropdown
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row mb-5 py-5 text-center position-relative">
        <div className="col-12 z-1">
          <h1 className="display-4 mb-3">Discover True Elegance</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Curated fashion and premium lifestyle essentials designed for the modern individual.
          </p>
        </div>
        {/* Background gradient orb */}
        <div 
          className="position-absolute top-50 start-50 translate-middle"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(233,69,96,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0, pointerEvents: 'none'
          }}
        ></div>
      </div>

      {/* Search and Filter Panel (Glassmorphism) */}
      <div className="row justify-content-center mb-5 position-relative z-1">
        <div className="col-lg-8">
          <div className="glass-panel p-4">
            <div className="row g-3">
              <div className="col-md-8">
                <input 
                  type="text" 
                  className="form-control form-control-lg border-0 shadow-sm" 
                  placeholder="Search products..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select form-select-lg border-0 shadow-sm" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4 position-relative z-1">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="p-5 glass-panel d-inline-block">
                <h3 className="mb-3 text-muted">No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <button className="btn btn-outline-primary mt-2" onClick={() => { setSearch(''); setCategory(''); }}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div className="col-md-6 col-lg-4" key={product.id}>
                <div className="card h-100 border-0">
                  <div className="card-img-wrapper">
                    <img src={product.image || 'https://via.placeholder.com/400x300'} alt={product.name} />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between mb-3 mt-1">
                      <span className="badge badge-primary">{product.category || 'Uncategorized'}</span>
                      {product.stock <= 0 ? (
                        <span className="badge bg-danger">Out of Stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="badge bg-warning text-dark">Low Stock: {product.stock} left</span>
                      ) : (
                        <span className="badge bg-success text-white">In Stock: {product.stock}</span>
                      )}
                    </div>
                    
                    <h5 className="card-title text-truncate mb-2" title={product.name}>
                      <Link to={`/product/${product.id}`} className="text-decoration-none text-reset">
                        {product.name}
                      </Link>
                    </h5>
                    
                    <div className="mb-3">
                      {product.discountPrice ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="price-tag">৳ {product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className="text-muted text-decoration-line-through small">৳ {product.price.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <span className="price-tag">৳ {product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    
                    <p className="card-text small text-muted flex-grow-1">
                      {product.description?.length > 70 
                        ? `${product.description.substring(0, 70)}...` 
                        : product.description}
                    </p>
                    
                    <div className="d-flex gap-2 mt-4 pt-3 border-top">
                      <Link to={`/product/${product.id}`} className="btn btn-outline-secondary flex-grow-1">
                        View
                      </Link>
                      <button 
                        className="btn btn-primary flex-grow-1"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
