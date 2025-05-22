import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactsDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  
  const handleAddContact = () => {
    navigate('/add-contact');
  };
  
  const handleViewContacts = () => {
    navigate('/contacts');
  };
  const goBackToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 pt-12">
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Dashboard</h1>
        <button
          onClick={goBackToHome}
          className="mb-6 flex items-center text-white hover:text-indigo-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10 px-4">
          {/* Add New Contact Card */}
          <div 
            className={`bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 lg:w-1/3 max-w-md flex flex-col items-center transition-all duration-300 cursor-pointer ${
              hoveredCard === 'add' ? 'transform scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredCard('add')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleAddContact}
          >
            <div className="bg-indigo-600 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Contact</h2>
            <p className="text-gray-600 text-center mb-6">Create and store new contact information in your database</p>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md font-medium transition duration-300"
              onClick={handleAddContact}
            >
              Create Contact
            </button>
          </div>
          
          {/* View Contacts Card */}
          <div 
            className={`bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 lg:w-1/3 max-w-md flex flex-col items-center transition-all duration-300 cursor-pointer ${
              hoveredCard === 'view' ? 'transform scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredCard('view')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleViewContacts}
          >
            <div className="bg-indigo-600 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Your Contacts</h2>
            <p className="text-gray-600 text-center mb-6">Access and manage your existing contact list</p>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md font-medium transition duration-300"
              onClick={handleViewContacts}
            >
              View Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}