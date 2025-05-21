import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import * as THREE from 'three';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mountRef = useRef(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
    renderer.setClearColor(0x000000, 0);
    
    // Only append if mountRef is defined and doesn't already have a child
    if (mountRef.current && mountRef.current.childElementCount === 0) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create floating contacts visualization
    const contacts = [];
    const contactGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    // Different colors for contact spheres
    const colors = [
      0x4299e1, // blue
      0x9f7aea, // purple
      0x48bb78, // green
      0xed8936, // orange
      0xf56565, // red
    ];

    // Create 25 contact spheres
    for (let i = 0; i < 25; i++) {
      const contactMaterial = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        shininess: 100
      });
      
      const contact = new THREE.Mesh(contactGeometry, contactMaterial);
      
      // Randomly position spheres in a cloud formation
      contact.position.x = (Math.random() - 0.5) * 20;
      contact.position.y = (Math.random() - 0.5) * 20;
      contact.position.z = (Math.random() - 0.5) * 20;
      
      // Store velocity for animation
      contact.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      };
      
      scene.add(contact);
      contacts.push(contact);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 15;

    // Create lines connecting nearby contacts
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a5568,
      transparent: true,
      opacity: 0.3
    });

    const lines = [];

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 0.6;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Update contact positions
      contacts.forEach(contact => {
        contact.position.add(contact.userData.velocity);
        
        // Bounce off invisible boundaries
        ['x', 'y', 'z'].forEach(axis => {
          if (Math.abs(contact.position[axis]) > 10) {
            contact.userData.velocity[axis] *= -1;
          }
        });
        
        // Slowly rotate each contact
        contact.rotation.x += 0.005;
        contact.rotation.y += 0.005;
      });
      
      // Remove old lines
      lines.forEach(line => scene.remove(line));
      lines.length = 0;
      
      // Create new connection lines between nearby contacts
      for (let i = 0; i < contacts.length; i++) {
        for (let j = i + 1; j < contacts.length; j++) {
          const distance = contacts[i].position.distanceTo(contacts[j].position);
          
          if (distance < 5) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
              contacts[i].position,
              contacts[j].position
            ]);
            
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            lines.push(line);
          }
        }
      }
      
      // Slowly rotate the entire scene for a dynamic effect
      scene.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      contacts.forEach(contact => {
        contact.geometry.dispose();
        contact.material.dispose();
      });
      
      lines.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
      });
    };
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with 3D Animation */}
        <section className="bg-gradient-to-b from-indigo-900 to-indigo-700 text-white">
          <div className="container mx-auto px-4 py-20 relative">
            <div className="text-center mb-12 z-10 relative">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Manage Your Contacts Effortlessly</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                A simple, powerful contacts management solution built for professionals and teams
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              </button>
            </div>
            
            {/* Container for the Three.js animation */}
            <div className="absolute inset-0 z-0" ref={mountRef}></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Why Choose ContactsManager?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Organized Storage</h3>
                <p className="text-gray-600">
                  Keep all your contacts in one place with powerful organization tools and custom categories.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Secure Access</h3>
                <p className="text-gray-600">
                  Your contacts are protected with industry-standard security and controlled access management.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Always Synced</h3>
                <p className="text-gray-600">
                  Access your contacts from any device with real-time synchronization and cloud backup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-indigo-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Ready to manage your contacts better?</h2>
            <p className="text-xl mb-8 text-indigo-700 max-w-2xl mx-auto">
              Join thousands of users who have simplified their contact management with our platform.
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-md"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Start for Free'}
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;