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
  <div className="fixed top-16 w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
    <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add Employee Info
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["user","name","email","position","role","department"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            placeholder={field.toUpperCase()}
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        ))}

        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="p-3 border rounded-xl"
        />

        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="p-3 border rounded-xl"
        />

        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-3 rounded-xl font-semibold hover:scale-[1.02] transition"
        >
          Add Employee
        </button>
      </form>

      <ToastContainer />
    </div>
  </div>
);}
export default AddInfo;