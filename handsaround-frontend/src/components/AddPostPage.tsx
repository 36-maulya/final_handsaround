// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

const DEFAULT_EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1751666526244-40239a251eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2MTU4MzIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZG9uYXRpb24lMjBjaGFyaXR5fGVufDF8fHx8MTc2MTYzNjEzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1713201668195-109a045fb05b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY2xlYW51cCUyMG5hdHVyZXxlbnwxfHx8fDE3NjE2MzYxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
];

export const AddPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addEvent } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [volunteersNeeded, setVolunteersNeeded] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  if (!user || user.role !== 'ngo') {
    navigate('/');
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type || !date || !time || !location || !description || !volunteersNeeded) {
      toast.error('Please fill in all required fields');
      return;
    }

    const finalPhotoUrl = photoUrl || DEFAULT_EVENT_IMAGES[Math.floor(Math.random() * DEFAULT_EVENT_IMAGES.length)];

    addEvent({
      name,
      type,
      date,
      time,
      location,
      description,
      volunteersNeeded: parseInt(volunteersNeeded),
      photoUrl: finalPhotoUrl,
    });

    toast.success('Event posted successfully!');
    navigate('/ngo/posts');
  };

  const handleCancel = () => {
    navigate('/profile');
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
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-green-700 dark:text-green-400 mb-8">Add New Event</h1>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Fill in the information about your volunteer event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Event Photo</Label>
                <div className="flex flex-col gap-3">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload or use default image
                      </p>
                    </label>
                  </div>
                  {photoUrl && (
                    <ImageWithFallback
                      src={photoUrl}
                      alt="Event preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Community Food Drive"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Type of Event *</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food Distribution">Food Distribution</SelectItem>
                    <SelectItem value="Environmental Cleanup">Environmental Cleanup</SelectItem>
                    <SelectItem value="Education & Teaching">Education & Teaching</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Community Development">Community Development</SelectItem>
                    <SelectItem value="Animal Welfare">Animal Welfare</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., 123 Main Street, City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event and what volunteers will be doing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Volunteers Needed */}
              <div className="space-y-2">
                <Label htmlFor="volunteers">Number of Volunteers Needed *</Label>
                <Input
                  id="volunteers"
                  type="number"
                  min="1"
                  placeholder="e.g., 20"
                  value={volunteersNeeded}
                  onChange={(e) => setVolunteersNeeded(e.target.value)}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Post Event
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
