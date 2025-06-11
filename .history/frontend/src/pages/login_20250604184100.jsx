import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      navigate("/Dasboard"); 
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white relative z-10 px-6">
        <div className="absolute inset-0 opacity-5 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url('/assets/logo.jpg')` }}></div>

        <div className="w-full max-w-md z-20">
          <div className="flex justify-center mb-4">
            <img src="/assets/Wm2.jpg" alt="Sidoarjo" className="h-12" />
          </div>

          <h2 className="text-4xl font-bold text-green-900 text-center">Log In</h2>
          <p className="text-sm text-center text-gray-600 mb-6">Log in with registered account</p>

          <form className="space-y-4" onSubmit={Auth}>
            <div>
              <label className="text-sm font-medium">Username or Email*</label>
              <input type="text" className="w-full border px-4 py-2 rounded mt-1" 
              value={email} onChange={(e) => setEmail (e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password*</label>
              <input type="password" className="w-full border px-4 py-2 rounded mt-1" 
              value={password} onChange={(e) => setPassword (e.target.value)} />
              <div className="text-right text-sm mt-1 text-blue-600 hover:underline cursor-pointer">
                Forgot your password?
              </div>
            </div>
            <button type="submit" className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800 transition">
              Log In
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Dont have an account?{' '}
            <a href="/register" className="text-green-800 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-cover bg-center items-center justify-center" style={{ backgroundImage: `url('/assets/login-image.jpg')` }}>
        <div className="bg-black bg-opacity-60 p-10 rounded text-white max-w-md text-center mx-4">
          <h3 className="text-2xl font-semibold mb-2">Embrace the Wisdom of Tradition for a Modern Life</h3>
          <p className="text-sm">
            Discover the power of natural ingredients, time-honored recipes, and sustainable living. From traditional herbal remedies to nutritious local dishes, unlock a healthier lifestyle inspired by Indonesia s rich culture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
