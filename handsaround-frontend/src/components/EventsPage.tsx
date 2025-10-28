// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Building2, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, events, registerForEvent, unregisterFromEvent, getEventRegistrations, registrations } = useApp();
  
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [volunteerName, setVolunteerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [unregisterEventId, setUnregisterEventId] = useState<string | null>(null);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleRegisterClick = (eventId: string) => {
    if (user.role !== 'volunteer') {
      toast.error('Only volunteers can register for events');
      return;
    }

    // Check if already registered
    const alreadyRegistered = registrations.find(
      r => r.eventId === eventId && r.volunteerId === user.id
    );

    if (alreadyRegistered) {
      toast.info('You are already registered for this event');
      return;
    }

    setSelectedEvent(eventId);
    setVolunteerName(user.name);
    setPhoneNumber('');
  };

  const handleSubmitRegistration = () => {
    if (!selectedEvent) return;

    if (!volunteerName || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = registerForEvent(selectedEvent, volunteerName, phoneNumber);
    if (success) {
      toast.success('Successfully registered for the event!');
      setSelectedEvent(null);
      setVolunteerName('');
      setPhoneNumber('');
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleUnregisterClick = (eventId: string) => {
    setUnregisterEventId(eventId);
  };

  const handleConfirmUnregister = () => {
    if (!unregisterEventId) return;

    const success = unregisterFromEvent(unregisterEventId);
    if (success) {
      toast.success('Successfully unregistered from the event');
      setUnregisterEventId(null);
    } else {
      toast.error('Failed to unregister. Please try again.');
    }
  };

  const isUserRegistered = (eventId: string) => {
    return registrations.some(r => r.eventId === eventId && r.volunteerId === user.id);
  };

  // Filter and sort upcoming events only (future dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  });
  
  const sortedEvents = [...upcomingEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;

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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-green-700 dark:text-green-400 mb-2">Upcoming Events</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user.role === 'volunteer' 
              ? 'Discover and register for volunteer opportunities' 
              : 'Browse upcoming volunteer events'}
          </p>
        </div>

        {sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-gray-600 dark:text-gray-300 mb-2">No upcoming events</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {user.role === 'volunteer' 
                  ? 'Check back later for new volunteer opportunities' 
                  : 'No upcoming events at this time'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => {
              const eventRegistrations = getEventRegistrations(event.id);
              const spotsRemaining = event.volunteersNeeded - eventRegistrations.length;
              const isFull = spotsRemaining <= 0;
              const registered = isUserRegistered(event.id);

              return (
                <Card key={event.id} className="overflow-hidden flex flex-col">
                  <ImageWithFallback
                    src={event.photoUrl}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex-1">{event.name}</CardTitle>
                      {isFull && (
                        <Badge variant="destructive">FULL</Badge>
                      )}
                      {registered && (
                        <Badge className="bg-green-600">Registered</Badge>
                      )}
                    </div>
                    <CardDescription>{event.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Building2 className="w-4 h-4" />
                      <span>{event.ngoName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className={isFull ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {spotsRemaining > 0 ? `${spotsRemaining} spots remaining` : 'All spots filled'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="pt-3 mt-auto">
                      {user.role === 'volunteer' && (
                        registered ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>You are registered for this event</span>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                              onClick={() => handleUnregisterClick(event.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Unregister
                            </Button>
                          </div>
                        ) : isFull ? (
                          <Button disabled className="w-full" variant="secondary">
                            FULL - No Spots Available
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleRegisterClick(event.id)}
                          >
                            Register Now
                          </Button>
                        )
                      )}
                      {user.role === 'ngo' && (
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled
                        >
                          {isFull ? 'FULL' : `${spotsRemaining} spots available`}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Registration Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              {selectedEventData?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Your Name</Label>
              <Input
                id="reg-name"
                type="text"
                placeholder="Full Name"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">Phone Number</Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSubmitRegistration}
            >
              Confirm Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unregister Confirmation Dialog */}
      <AlertDialog open={!!unregisterEventId} onOpenChange={() => setUnregisterEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unregister from Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unregister from this event? This will free up your spot for other volunteers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmUnregister}
            >
              Yes, Unregister
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
