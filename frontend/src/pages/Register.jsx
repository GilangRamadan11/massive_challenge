import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', {
        name,
        email,
        password
      });

      navigate("/"); 
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative">
      <div className="absolute top-5 left-5">
        <h1 className="text-lg font-semibold"></h1>
      </div>

      <div className="w-full max-w-md p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-2">Sign up</h2>
        <p className="text-center text-sm mb-6">
          Already have account?{' '}
          <a href="/" className="text-blue-700 underline">
            log in here
          </a>
        </p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium mb-1">Name*</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email*</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password*</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-green-900 text-white rounded-md hover:bg-green-800"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
