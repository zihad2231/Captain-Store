import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    image: '',
    stock: 10
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadToImgBB = async (file) => {
    // You should use your actual ImgBB API key here or in .env
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY';
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
      return null;
    } catch (err) {
      console.error("ImgBB upload failed", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        setUploadingImage(true);
        const uploadedUrl = await uploadToImgBB(imageFile);
        setUploadingImage(false);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError('Failed to upload image to ImgBB.');
          setLoading(false);
          return;
        }
      }

      const productToCreate = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock, 10) || 0
      };

      const result = await createProduct(productToCreate);
      if (result) {
        navigate('/');
      } else {
        setError('Failed to create product. Please try again.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="card-title fw-bold text-center mb-4">Add New Product</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">Product Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Spyglass"
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label fw-bold">Price (৳)</label>
                    <input 
                      type="number" 
                      step="1"
                      className="form-control" 
                      id="price" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 2999"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="discountPrice" className="form-label fw-bold">Discount Price (৳)</label>
                    <input 
                      type="number" 
                      step="1"
                      className="form-control" 
                      id="discountPrice" 
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="imageFile" className="form-label fw-bold">Product Image</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="imageFile" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {uploadingImage && <div className="form-text text-info">Image will be uploaded on submit...</div>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">Description</label>
                  <textarea 
                    className="form-control" 
                    id="description" 
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter product description here..."
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="stock" className="form-label fw-bold">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="stock" 
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
