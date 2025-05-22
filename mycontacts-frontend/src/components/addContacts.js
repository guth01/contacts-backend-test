import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Phone number is required' });
      return false;
    }
    if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        // Redirect to login page
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5001/api/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create contact');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: 'Contact created successfully!' });
      setFormData({ name: '', email: '', phone: '' });

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create contact' });
    } finally {
      setLoading(false);
    }
  };

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={goBackToDashboard}
            className="mb-6 flex items-center text-white hover:text-indigo-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Contact</h1>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-4 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Contact...
                  </div>
                ) : (
                  'Create Contact'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}