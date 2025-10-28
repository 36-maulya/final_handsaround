// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ArrowLeft, LogOut, Moon, Sun, Plus, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, theme, setTheme } = useApp();

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Hands Around Logo" className="h-12 w-12" />
            <span className="text-green-700 dark:text-green-400">HANDS AROUND</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-green-700 dark:text-green-400 mb-8">My Profile</h1>

        {/* User Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your registered details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-500 dark:text-gray-400">Full Name</Label>
              <p className="mt-1">{user.name}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-gray-500 dark:text-gray-400">Email</Label>
              <p className="mt-1">{user.email}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-gray-500 dark:text-gray-400">Account Type</Label>
              <p className="mt-1 capitalize">{user.role}</p>
            </div>
            {user.role === 'ngo' && (
              <>
                <Separator />
                <div>
                  <Label className="text-gray-500 dark:text-gray-400">Organization Name</Label>
                  <p className="mt-1">{user.organizationName}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Role-Specific Actions */}
        {user.role === 'ngo' ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>NGO Actions</CardTitle>
              <CardDescription>Manage your events and registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => navigate('/ngo/add-post')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/ngo/posts')}
              >
                <FileText className="w-4 h-4 mr-2" />
                View My Posts
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Volunteer Actions</CardTitle>
              <CardDescription>Explore and register for events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => navigate('/events')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Browse Upcoming Events
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Customize your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-3 block">Theme Preference</Label>
              <div className="flex gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => toggleTheme('light')}
                  className={theme === 'light' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => toggleTheme('dark')}
                  className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
