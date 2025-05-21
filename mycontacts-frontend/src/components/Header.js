import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // This effect will run on initial load and whenever the location changes
  // (like after a login redirect)
  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  const checkLoginStatus = () => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    
    if (token) {
      setIsLoggedIn(true);
      // If we have a username stored, use it
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        // If no username is stored but we have a token,
        // fetch the current user data from API
        fetchUserData(token);
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/current', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        // Store and set the username
        localStorage.setItem('username', userData.username);
        setUsername(userData.username);
      } else {
        // If the token is invalid, log the user out
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold">ContactsManager</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link>
            <Link to="/features" className="hover:text-indigo-200 transition-colors">Features</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="mr-2" size={18} />
                  <span>Hello, {username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link>
            <Link to="/features" className="hover:text-indigo-200 transition-colors">Features</Link>
            
            {isLoggedIn ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <User className="mr-2" size={18} />
                  <span>Hello, {username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;