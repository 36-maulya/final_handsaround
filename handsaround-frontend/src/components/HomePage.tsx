// @ts-nocheck
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { MapComponent } from './MapComponent';
import { MapPin, Calendar, User, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';
import LiveMap from './LiveMap';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, events, locationGranted, setLocationGranted } = useApp();
  const [showLocationAlert, setShowLocationAlert] = React.useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Show location alert after a short delay if not already granted
    if (!locationGranted) {
      const timer = setTimeout(() => {
        setShowLocationAlert(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, locationGranted]);

  const handleGrantLocation = () => {
    setLocationGranted(true);
    setShowLocationAlert(false);
    toast.success('Location access granted!');
  };

  const handleDenyLocation = () => {
    setShowLocationAlert(false);
    toast.info('You can grant location access later from your profile');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Hands Around Logo" className="h-12 w-12" />
            <span className="text-green-700 dark:text-green-400">HANDS AROUND</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(user.role === 'ngo' ? '/ngo/posts' : '/events')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {user.role === 'ngo' ? 'My Posts' : 'Events'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              My Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Location Access Alert */}
      {showLocationAlert && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 relative">
            <MapPin className="h-4 w-4 text-green-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-green-800 dark:text-green-200">
                Grant location access to see nearby events and your position on the map
              </span>
              <div className="flex gap-2 ml-4">
                <Button size="sm" onClick={handleGrantLocation} className="bg-green-600 hover:bg-green-700">
                  Grant Access
                </Button>
                <Button size="sm" variant="outline" onClick={handleDenyLocation}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content - Map */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-green-700 dark:text-green-400 mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore volunteer opportunities in your area
          </p>
        </div>

        {/* Map Container */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-2xl">
          <LiveMap events={events} />
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-600 dark:text-green-400 mb-2">{events.length}</div>
            <p className="text-gray-600 dark:text-gray-300">Active Events</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-600 dark:text-green-400 mb-2">
              {events.filter(e => new Date(e.date) > new Date()).length}
            </div>
            <p className="text-gray-600 dark:text-gray-300">Upcoming Events</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-600 dark:text-green-400 mb-2">
              {user.role === 'ngo' ? 'NGO' : 'Volunteer'}
            </div>
            <p className="text-gray-600 dark:text-gray-300">Your Role</p>
          </div>
        </div>
      </main>
    </div>
  );
};
