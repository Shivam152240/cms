import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './components/AdminDashboard';
import ModuleManager from './components/ModuleManager';
import BlogManager from "./pages/BlogPage";
import GalleryManager from "./pages/GalleryPage";
import Login from "./pages/Login";
import Register from './pages/Register';
import Profile from './pages/Profile';


const API = 'https://cms-xjfn.onrender.com/api';

function App(){
  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API}/admin/modules`);
      const payload = Array.isArray(res.data) ? res.data : (res.data?.value || []);
      const active = payload.filter(m => m && m.active);
      setModules(active);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setModules([]);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <BrowserRouter>
      <Navbar modules={modules} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login />} />
      <Route path="/register" element={<Register />} />


        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/modules" element={<ModuleManager />} />
        {modules.find(m => m.name?.toLowerCase() === 'blog') && <Route path='/blog' element={<BlogPage/>} />}
        {modules.find(m => m.name?.toLowerCase() === 'gallery') && <Route path='/gallery' element={<GalleryPage/>} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
