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
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
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
      <div className="row mb-5">
        <div className="col-12 text-center mt-4">
          <h1 className="display-4 fw-bold">Discover Elegance</h1>
          <p className="lead text-muted">Curated fashion and lifestyle essentials for the modern individual.</p>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-3">
            <div className="row g-2">
              <div className="col-md-8">
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="Search products..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select form-select-lg" 
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

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted fs-5">No products found matching your criteria.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div className="col-md-4" key={product.id}>
                <div className="card h-100 shadow-sm border-0 transition-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="card-img-wrapper">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="d-flex justify-content-between mb-2 mt-3">
                      <span className="badge bg-light text-dark border">{product.category || 'Uncategorized'}</span>
                      {product.isAvailable === false ? (
                        <span className="badge bg-danger">Out of Stock</span>
                      ) : (
                        product.stock <= 5 && <span className="badge bg-warning text-dark">Low Stock</span>
                      )}
                    </div>
                    <h5 className="card-title fw-bold mt-2 text-truncate" title={product.name}>{product.name}</h5>
                    <div className="mb-3">
                      {product.discountPrice ? (
                        <>
                          <span className="card-subtitle text-primary fs-5 fw-bold me-2">৳ {product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className="text-muted text-decoration-line-through small">৳ {product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className="card-subtitle text-primary fs-5 fw-bold">৳ {product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <p className="card-text text-muted flex-grow-1">
                      {product.description.length > 60 
                        ? `${product.description.substring(0, 60)}...` 
                        : product.description}
                    </p>
                    
                    <div className="d-flex justify-content-between mt-3 gap-2">
                      <Link to={`/product/${product.id}`} className="btn btn-outline-secondary w-50">
                        Details
                      </Link>
                      <button 
                        className="btn btn-primary w-50"
                        onClick={() => addToCart(product)}
                        disabled={product.isAvailable === false}
                      >
                        {product.isAvailable === false ? 'Unavailable' : 'Add to Cart'}
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
