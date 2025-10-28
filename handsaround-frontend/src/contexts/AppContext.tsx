// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// ----------------------
// Interfaces
// ----------------------
export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'ngo' | 'volunteer';
  organizationName?: string;
  token?: string;
}

export interface Event {
  _id?: string;
  ngoId: string;
  ngoName: string;
  name: string; // frontend uses `name`
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  volunteersNeeded: number;
  photoUrl: string;
  latitude?: number;
  longitude?: number;
}

export interface Registration {
  _id?: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  phoneNumber: string;
}

interface AppContextType {
  user: User | null;
  events: Event[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'ngo' | 'volunteer',
    organizationName?: string
  ) => Promise<boolean>;
  logout: () => void;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, '_id' | 'ngoId' | 'ngoName'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

// ----------------------
// Context Creation
// ----------------------
const AppContext = createContext<AppContextType | undefined>(undefined);

// ✅ API base URL (from frontend .env)
const API = import.meta.env.VITE_API_BASE;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // ----------------------
  // Load user from localStorage
  // ----------------------
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ----------------------
  // Login
  // ----------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const loggedInUser = res.data.user;
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  // ----------------------
  // Register
  // ----------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'ngo' | 'volunteer',
    organizationName?: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post(`${API}/auth/register`, {
        name,
        email,
        password,
        role,
        organizationName,
      });
      const newUser = res.data.user;
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (err) {
      console.error('Register failed:', err);
      return false;
    }
  };

  // ----------------------
  // Logout
  // ----------------------
  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  // ----------------------
  // Fetch Events (maps backend title → name)
  // ----------------------
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      const fixedEvents = (res.data.events || []).map((e: any) => ({
        ...e,
        name: e.title || e.name, // ✅ backend sends 'title', frontend uses 'name'
      }));
      setEvents(fixedEvents);
    } catch (err) {
      console.error('Fetching events failed:', err);
    }
  };

  // ----------------------
  // Add Event (maps name → title before sending)
  // ----------------------
  const addEvent = async (event: Omit<Event, '_id' | 'ngoId' | 'ngoName'>) => {
    if (!user) return;
    try {
      const res = await axios.post(
        `${API}/events`,
        { ...event, title: event.name }, // ✅ convert name → title for backend
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const newEvent = { ...res.data.event, name: res.data.event.title }; // normalize title → name again
      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      console.error('Add event failed:', err);
    }
  };

  // ----------------------
  // Delete Event
  // ----------------------
  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`${API}/events/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Delete event failed:', err);
    }
  };

  // ----------------------
  // Context Provider
  // ----------------------
  return (
    <AppContext.Provider
      value={{
        user,
        events,
        login,
        register,
        logout,
        fetchEvents,
        addEvent,
        deleteEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ----------------------
// Hook Export
// ----------------------
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
