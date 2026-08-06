import React, { useEffect, useState } from 'react';
import { getProducts, updateProduct, deleteProduct, createProduct } from '../../services/api';

const InventoryControl = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', discountPrice: '', image: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleToggleAvailability = async (product) => {
    const updated = await updateProduct(product.id, { isAvailable: !product.isAvailable });
    if (updated) {
      setProducts(products.map(p => (p.id === product.id ? updated : p)));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const created = await createProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      discountPrice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : null
    });
    if (created) {
      setProducts([...products, created]);
      setShowAddForm(false);
      setNewProduct({ name: '', price: '', description: '', discountPrice: '', image: '' });
    }
  };

  if (loading) return <div>Loading Inventory...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inventory Control</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4 p-3 shadow-sm">
          <h4>Add Product</h4>
          <form onSubmit={handleAddSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Product Name" required 
                  value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="number" className="form-control" placeholder="Price" required min="0" step="0.01"
                  value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="number" className="form-control" placeholder="Discount Price" min="0" step="0.01"
                  value={newProduct.discountPrice} onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})} />
              </div>
              <div className="col-md-12">
                <input type="text" className="form-control" placeholder="Image URL (optional)"
                  value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              </div>
              <div className="col-md-12">
                <textarea className="form-control" placeholder="Description" required rows="2"
                  value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
              </div>
              <div className="col-md-12">
                <button type="submit" className="btn btn-success">Save Product</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${product.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn btn-sm me-2 ${product.isAvailable ? 'btn-outline-warning' : 'btn-outline-success'}`}
                    onClick={() => handleToggleAvailability(product)}
                  >
                    {product.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryControl;
