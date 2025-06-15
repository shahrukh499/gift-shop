'use client';

import { useState } from 'react';
import { API_CONFIG, getApiUrl } from '../utils/apiConfig';

export default function AdminAddProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState([{ label: "", available: true }]);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = field === 'available' ? value : value.toUpperCase();
    setSizes(updatedSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { label: "", available: true }]);
  };
  
  const removeSizeField = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);
    setImagePreviews(fileList.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('Please upload at least one product image!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const imageUrls = [];

      // Upload images one by one
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/v1/products/upload-image', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed');
        }

        imageUrls.push(uploadData.imageUrl); // string URL
      }

      const productPayload = {
        name,
        price: Number(price),
        discount: Number(discount),
        category,
        subcategory,
        brand,
        description,
        stock: Number(stock),
        images: imageUrls,
        sizes
      };

      const apiUriProduct = getApiUrl(API_CONFIG.ENDPOINTS.ADDPRODUCT);
      const requestOptionsProduct = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        productPayload
      );

      const productRes = await fetch(apiUriProduct, requestOptionsProduct);
      const productData = await productRes.json();

      if (!productRes.ok) {
        throw new Error(productData.message || 'Product creation failed');
      }

      setMessage('✅ Product created successfully!');
      // Clear form
      setName('');
      setPrice('');
      setDiscount('');
      setCategory('');
      setSubcategory('');
      setBrand('');
      setDescription('');
      setStock('');
      setFiles([]);
      setImagePreviews([]);

    } catch (error) {
      console.error('Error during image upload or product creation:', error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      {message && (
        <div className={`mb-4 text-center font-semibold ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="number" placeholder="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Stock Quantity" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-2 border rounded" required />
        
        {sizes.map((size, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Size (e.g. S, M, L)"
              value={size.label}
              onChange={(e) => handleSizeChange(index, "label", e.target.value)}
              className="p-2 border rounded w-20"
              required
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={size.available}
                onChange={(e) => handleSizeChange(index, "available", e.target.checked)}
              />
              Available
            </label>
            <button type="button" onClick={() => removeSizeField(index)} className="text-red-500">
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSizeField}
          className="text-blue-500 underline mb-4"
        >
          + Add Size
        </button>

        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full" required />
        <div className="flex flex-wrap gap-2 mt-2">
          {imagePreviews.map((src, i) => (
            <img key={i} src={src} alt={`Preview ${i}`} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
