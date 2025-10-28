// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, Users, MapPin, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const NGOPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, events, deleteEvent, getEventRegistrations } = useApp();
  
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  if (!user || user.role !== 'ngo') {
    navigate('/');
    return null;
  }

  const myEvents = events.filter(event => event.ngoId === user.id);

  const handleViewRegistrations = (eventId: string) => {
    setSelectedEvent(eventId);
  };

  const handleEditEvent = (eventId: string) => {
    toast.info('Edit functionality - Coming soon!');
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      toast.success('Event deleted successfully');
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;
  const registrations = selectedEvent ? getEventRegistrations(selectedEvent) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Hands Around Logo" className="h-12 w-12" />
            <span className="text-green-700 dark:text-green-400">HANDS AROUND</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-green-700 dark:text-green-400">My Posts</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your organization's volunteer events
            </p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/ngo/add-post')}
          >
            Add New Event
          </Button>
        </div>

        {myEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-gray-600 dark:text-gray-300 mb-2">No events posted yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start by creating your first volunteer event
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/ngo/add-post')}
              >
                Create Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => {
              const eventRegistrations = getEventRegistrations(event.id);
              const spotsRemaining = event.volunteersNeeded - eventRegistrations.length;

              return (
                <Card key={event.id} className="overflow-hidden">
                  <ImageWithFallback
                    src={event.photoUrl}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className={spotsRemaining > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {eventRegistrations.length}/{event.volunteersNeeded} registered
                      </span>
                    </div>

                    <div className="pt-3 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewRegistrations(event.id)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Registrations ({eventRegistrations.length})
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDeleteClick(event.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Registrations</DialogTitle>
            <DialogDescription>
              {selectedEventData?.name} - {registrations.length} volunteer(s) registered
            </DialogDescription>
          </DialogHeader>
          
          {registrations.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No registrations yet
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((registration, index) => (
                <Card key={registration.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Volunteer #{index + 1}
                        </p>
                        <p className="mt-1">{registration.volunteerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {registration.phoneNumber}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event and all its registrations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
