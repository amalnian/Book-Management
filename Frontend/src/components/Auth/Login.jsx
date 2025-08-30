// Updated Login.js component with toast
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show success message if coming from registration
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state to prevent showing message again on refresh
      window.history.replaceState({}, document.title);
    }

    if (user) {
      navigate('/books');
    }
  }, [user, navigate, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Show loading toast
    const loadingToast = toast.loading('Signing you in...');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Welcome back! 🎉');
        navigate('/books');
      } else {
        // Dismiss loading toast and show errors
        toast.dismiss(loadingToast);
        
        // Handle different types of errors
        const errorData = result.error || {};
        
        if (errorData.detail) {
          toast.error(errorData.detail);
        } else if (errorData.email) {
          toast.error(`Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`);
        } else if (errorData.password) {
          toast.error(`Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}`);
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
        
        setErrors(errorData);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                </p>
              )}
            </div>
          </div>

          {(errors.detail || errors.error) && (
            <div className="text-red-600 text-sm text-center">
              {errors.detail || errors.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;