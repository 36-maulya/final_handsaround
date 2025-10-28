// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart, Users, Calendar } from 'lucide-react';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Hands Around Logo" className="h-12 w-12" />
            <span className="text-green-700 dark:text-green-400">HANDS AROUND</span>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-green-600 hover:bg-green-700">
            Login/Register
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-green-700 dark:text-green-400 mb-6">
          Stay Safe Stay Connected Stay Informed
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Connecting passionate volunteers with meaningful NGO opportunities to create lasting impact in communities
        </p>
        <Button 
          onClick={() => navigate('/auth')} 
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          Get Started Today
        </Button>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-green-700 dark:text-green-400 mb-3">Discover Opportunities</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse and find volunteer events that match your passion and availability
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-green-700 dark:text-green-400 mb-3">Post Needs</h3>
            <p className="text-gray-600 dark:text-gray-300">
              NGOs can easily post events and connect with dedicated volunteers
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-green-700 dark:text-green-400 mb-3">Make an Impact</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join forces to create positive change and strengthen our communities
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 dark:bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImage} alt="Hands Around Logo" className="h-10 w-10" />
                <span>HANDS AROUND</span>
              </div>
              <p className="text-green-100">
                Building bridges between volunteers and NGOs
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-green-300 transition-colors">Facebook</a>
                <a href="#" className="hover:text-green-300 transition-colors">Twitter</a>
                <a href="#" className="hover:text-green-300 transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-700 pt-8 text-center text-green-100">
            <p>&copy; 2025 Hands Around. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
