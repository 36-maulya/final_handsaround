// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/640971e90cb7a24ba24fe57cc2b9ebe294d92a11.png';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useApp();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'ngo' | 'volunteer'>('volunteer');
  const [regOrgName, setRegOrgName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginEmail, loginPassword);
    if (success) {
      toast.success('Login successful!');
      navigate('/home');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regRole === 'ngo' && !regOrgName) {
      toast.error('Organization name is required for NGOs');
      return;
    }
    const success = register(regName, regEmail, regPassword, regRole, regOrgName);
    if (success) {
      toast.success('Registration successful!');
      navigate('/home');
    } else {
      toast.error('Email already exists. Please use a different email.');
    }
  };

  const handleForgotPassword = () => {
    toast.info('Password reset link sent to your email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex justify-center mb-6">
          <img src={logoImage} alt="Hands Around Logo" className="h-20 w-20" />
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to your account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password? Reset
                  </Button>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Register to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="John Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <RadioGroup value={regRole} onValueChange={(value) => setRegRole(value as 'ngo' | 'volunteer')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="volunteer" id="volunteer" />
                        <Label htmlFor="volunteer" className="cursor-pointer">Volunteer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ngo" id="ngo" />
                        <Label htmlFor="ngo" className="cursor-pointer">NGO</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {regRole === 'ngo' && (
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input
                        id="org-name"
                        type="text"
                        placeholder="Your Organization"
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Register
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
