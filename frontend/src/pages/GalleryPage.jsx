import React, { useEffect, useState } from "react";
import './galleryPage.css';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gallery");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const addImage = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      return alert("Please signup first");
    }
    if (!file) return alert("Please select an image first!");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", user._id)

    try {
      const res = await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        body: formData,
      });
      const newImage = await res.json();
      setImages([newImage, ...images]);
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteImage = async (id) => {
    if (!token) {
      console.log('No token found');
      return alert('Please login first');
    }

    console.log('Attempting to delete image:', id);
    console.log('User:', user);
    console.log('Token:', token);

    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const error = await res.json();
        console.error('Delete failed:', error);
        throw new Error(error.message || 'Failed to delete image');
      }

      console.log('Delete successful');
      setImages(images.filter((img) => img._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Error deleting image');
    }
  };

  return (
    <div className="gallery-page">
      <h1>Manage Gallery</h1>

      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={addImage}>Upload</button>
      </div>

      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img._id} className="gallery-card">
            <img
              src={`http://localhost:5000${encodeURI(img.url)}`}
              alt={img.title || 'Gallery'}
              className="gallery-image"
              onError={(e) => {
                console.error('Image failed to load:', img, e);
                e.target.src = '/placeholder-image.png'; // optional local fallback
              }}
            />
            <button onClick={() => deleteImage(img._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
