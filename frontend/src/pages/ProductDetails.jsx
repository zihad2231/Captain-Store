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
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 mb-4 text-center">
          <div className="card-img-wrapper rounded shadow-sm">
            <img src={product.image} alt={product.name} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-3">
            <span className="badge bg-light text-dark border me-2 fs-6">{product.category || 'Uncategorized'}</span>
            {product.stock <= 0 ? (
              <span className="badge bg-danger fs-6">Out of Stock</span>
            ) : (
              <span className="badge bg-success fs-6">In Stock: {product.stock} left</span>
            )}
          </div>
          
          <div className="mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-primary h2 fw-bold me-2">৳ {product.discountPrice.toLocaleString('en-IN')}</span>
                <span className="text-muted text-decoration-line-through h4">৳ {product.price.toLocaleString('en-IN')}</span>
              </>
            ) : (
              <h3 className="text-primary">৳ {product.price.toLocaleString('en-IN')}</h3>
            )}
          </div>
          <p className="lead text-muted">{product.description}</p>
          
          <div className="d-grid gap-2 mt-5">
            <button 
              className="btn btn-primary btn-lg flex-grow-1"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <Link to="/" className="btn btn-outline-secondary btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
