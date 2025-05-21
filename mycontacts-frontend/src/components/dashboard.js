import { useState } from 'react';

export default function ContactsDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 pt-12">
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Dashboard</h1>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10 px-4">
          {/* Add New Contact Card */}
          <div 
            className={`bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 lg:w-1/3 max-w-md flex flex-col items-center transition-all duration-300 cursor-pointer ${
              hoveredCard === 'add' ? 'transform scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredCard('add')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="bg-indigo-600 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Contact</h2>
            <p className="text-gray-600 text-center mb-6">Create and store new contact information in your database</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md font-medium transition duration-300">
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
          >
            <div className="bg-indigo-600 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Your Contacts</h2>
            <p className="text-gray-600 text-center mb-6">Access and manage your existing contact list</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md font-medium transition duration-300">
              View Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}