import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call your backend API for login
      console.log('Attempting login with:', { email: formData.email });
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login error:', errorData);
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Login successful, received token');
      
      // Store token in local storage (matches the backend response)
      localStorage.setItem('authToken', data.accessToken);
      
      // We need to get the user's data to display their username
      try {
        // Make a request to the current user endpoint
        const userResponse = await fetch('http://localhost:5001/api/users/current', {
          headers: {
            'Authorization': `Bearer ${data.accessToken}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('username', userData.username);
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
      }
      
      // Redirect to home page instead of dashboard
      navigate('/');
    } catch (err) {
      console.error('Login error caught:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 py-4">
            <h2 className="text-center text-2xl font-bold text-white">Login to Your Account</h2>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="text-gray-700 text-sm font-semibold">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;