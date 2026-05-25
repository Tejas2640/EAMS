import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

const AddInfo = () => {
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    email: '',
    position: '',
    role: '',
    department: '',
    salary: 10000,
    joiningDate: '',
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/info`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        user: '',
        name: '',
        email: '',
        position: '',
        role: '',
        department: '',
        salary: 10000,
        joiningDate: '',
      });
      toast.success('Info added successfully!');
    } catch (error) {
      console.error('Error adding info:', error);
      toast.error('Failed to add info!');
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
        Access Denied. Admins only.
      </div>
    );
  }

 return (
  <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
    
    <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40">
      
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Add Employee Info
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="user"
          value={formData.user}
          onChange={handleChange}
          placeholder="User ID"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="w-full border border-gray-300 bg-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />

        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-lg hover:shadow-xl"
        >
          Add Employee Info
        </button>
      </form>

      <ToastContainer position="bottom-right" autoClose={1200} />
    </div>
  </div>
);}

export default AddInfo;