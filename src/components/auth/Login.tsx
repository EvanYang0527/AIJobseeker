import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, Shield, Star, Lightbulb } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'Standard User',
      email: 'user@test.com',
      password: 'test123',
      description: 'Access all career development tracks',
      icon: User,
      color: 'primary'
    },
    {
      role: 'System Administrator',
      email: 'admin@test.com',
      password: 'admin123',
      description: 'Full system administration access',
      icon: Shield,
      color: 'warning'
    }
  ];

  const handleDemoLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      const usersData = localStorage.getItem('jobseeker_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const loggedInUser = users.find((u: any) => u.email === email);
        
        if (loggedInUser?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/track-selection');
        }
      } else {
        navigate('/track-selection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-neuro-bg flex relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-12 h-12 neuro-icon neuro-animate-float">
          <Star className="w-6 h-6 text-neuro-primary" />
        </div>
        <div className="absolute top-40 right-32 w-16 h-16 neuro-icon neuro-animate-float" style={{ animationDelay: '1s' }}>
          <Lightbulb className="w-8 h-8 text-neuro-secondary" />
        </div>
        <div className="absolute bottom-32 left-1/4 w-10 h-10 neuro-icon neuro-animate-float" style={{ animationDelay: '2s' }}>
          <Star className="w-5 h-5 text-neuro-warning" />
        </div>
      </div>

      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="neuro-card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 neuro-icon">
                <Lightbulb className="w-10 h-10 text-neuro-primary" />
              </div>
              <h2 className="text-3xl font-bold neuro-text-primary mb-2">Welcome to Lumina</h2>
              <p className="neuro-text-secondary text-lg">Your personal co-pilot from learning to earning</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="neuro-inset p-4 rounded-neuro-sm">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 mt-0.5 text-neuro-error flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neuro-error">Authentication Error</p>
                      <p className="text-sm mt-1 neuro-text-secondary">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold neuro-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 neuro-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="neuro-input pl-12"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold neuro-text-primary mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 neuro-text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="neuro-input pl-12 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 neuro-text-muted hover:text-neuro-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <div className="neuro-checkbox mr-3"></div>
                  <span className="neuro-text-secondary">Remember me</span>
                </label>
                <Link to="#" className="text-neuro-primary hover:text-neuro-primary-light font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-3/4 mx-auto neuro-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center py-4 rounded-neuro-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full text-center neuro-text-secondary hover:text-neuro-primary py-2 transition-colors flex items-center justify-center"
              >
                <span>Try demo accounts</span>
                <span className="ml-2 transform transition-transform duration-200" style={{ transform: showDemoAccounts ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>
              
              {showDemoAccounts && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  {demoAccounts.map((account, index) => {
                    const Icon = account.icon;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDemoLogin(account.email, account.password)}
                        className="w-full text-left neuro-surface hover:shadow-neuro-hover p-4 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 neuro-icon mr-4 ${
                            account.color === 'primary' ? 'bg-gradient-to-br from-neuro-primary to-neuro-primary-light' : 
                            'bg-gradient-to-br from-neuro-warning to-neuro-error'
                          }`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold neuro-text-primary">{account.role}</div>
                            <div className="neuro-text-secondary text-sm">{account.description}</div>
                            <div className="text-xs neuro-text-muted mt-1">{account.email}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 text-center border-t border-neuro-bg-dark pt-6">
              <p className="neuro-text-secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-neuro-primary hover:text-neuro-primary-light font-semibold transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-neuro-bg via-neuro-bg-light/10 to-neuro-bg-dark/20"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 neuro-surface p-4 neuro-animate-float">
          <p className="font-semibold neuro-text-primary">Welcome!</p>
        </div>
        
        <div className="absolute bottom-32 right-20 neuro-surface p-4 neuro-animate-float" style={{ animationDelay: '1s' }}>
          <p className="font-semibold neuro-text-primary">Let's grow!</p>
        </div>

        <div className="max-w-lg relative z-10">
          <div className="neuro-card">
            <img 
              src="/src/assets/images/login_page_icon.png" 
              alt="Learning Illustration" 
              className="w-full h-auto rounded-neuro"
            />
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold neuro-text-primary mb-2">Your Journey Starts Here!</h3>
              <p className="neuro-text-secondary">From learning to earning, we're with you every step of the way</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};