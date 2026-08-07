import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel p-5 d-inline-block mt-5">
          <h2 className="mb-4">Product Not Found</h2>
          <p className="text-muted mb-4">The item you are looking for does not exist or has been removed.</p>
          <Link to="/" className="btn btn-primary px-5">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="mb-4">
        <Link to="/" className="text-muted text-decoration-none hover-primary">
          &larr; Back to Shop
        </Link>
      </div>
      
      <div className="row g-5 align-items-center">
        {/* Product Image Side */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="product-hero-image">
            <img 
              src={product.image || 'https://via.placeholder.com/600x600'} 
              alt={product.name} 
              className="img-fluid w-100"
            />
          </div>
        </div>
        
        {/* Product Details Side */}
        <div className="col-lg-6">
          <div className="ps-lg-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="badge badge-primary fs-6">{product.category || 'Uncategorized'}</span>
              {product.stock <= 0 ? (
                <span className="badge bg-danger fs-6 shadow-sm">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="badge bg-warning text-dark fs-6 shadow-sm">Low Stock ({product.stock} left)</span>
              ) : null}
            </div>
            
            <h1 className="display-4 mb-3">{product.name}</h1>
            
            <div className="mb-4 d-flex align-items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <span className="price-tag fs-1">৳ {product.discountPrice.toLocaleString('en-IN')}</span>
                  <span className="text-muted text-decoration-line-through fs-4">৳ {product.price.toLocaleString('en-IN')}</span>
                </>
              ) : (
                <span className="price-tag fs-1">৳ {product.price.toLocaleString('en-IN')}</span>
              )}
            </div>
            
            <div className="bg-light p-4 rounded-4 mb-5 border shadow-sm">
              <h5 className="fw-bold mb-3">Description</h5>
              <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
                {product.description}
              </p>
            </div>
            
            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
              <button 
                className="btn btn-primary btn-lg flex-grow-1 shadow-md"
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                style={{ padding: '1rem' }}
              >
                {product.stock <= 0 ? 'Currently Unavailable' : 'Add to Cart —'}
              </button>
            </div>
            
            <div className="mt-5 border-top pt-4 text-muted small">
              <div className="d-flex gap-4">
                <div><strong className="text-dark">Availability:</strong> {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}</div>
                {product.stock > 0 && <div><strong className="text-dark">SKU:</strong> NEX-{product.id}-2026</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
