import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewContacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingContact, setEditingContact] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please login again.' });
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5001/api/contacts/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to load contacts' });
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      );
      setFilteredContacts(filtered);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        throw new Error('Failed to delete contact');
      }

      setContacts(contacts.filter(contact => contact._id !== contactId));
      setMessage({ type: 'success', text: 'Contact deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete contact' });
    }
  };

  const startEditing = (contact) => {
    setEditingContact(contact._id);
    setEditFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  };

  const cancelEditing = () => {
    setEditingContact(null);
    setEditFormData({ name: '', email: '', phone: '' });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
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
        throw new Error('Failed to update contact');
      }

      const updatedContact = await response.json();
      setContacts(contacts.map(contact => 
        contact._id === contactId ? updatedContact : contact
      ));
      setEditingContact(null);
      setMessage({ type: 'success', text: 'Contact updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update contact' });
    }
  };

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 py-12">
      <div className="container mx-auto px-4">
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

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Contacts</h1>

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

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Contacts Display */}
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">
                {contacts.length === 0 ? 'No contacts found. Add your first contact!' : 'No contacts match your search.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingContact === contact._id ? (
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingContact === contact._id ? (
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{contact.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingContact === contact._id ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{contact.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingContact === contact._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(contact._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(contact)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Contact Count */}
          <div className="mt-4 text-sm text-gray-500">
            Total contacts: {contacts.length}
            {searchTerm && ` | Showing: ${filteredContacts.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}