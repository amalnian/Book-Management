// Updated Register.js component with toast
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match!');
      setErrors({ password_confirm: ['Passwords do not match'] });
      setLoading(false);
      return;
    }

    const loadingToast = toast.loading('Creating your account...');

    try {
      const result = await register(formData);
      
      if (result.success) {
        toast.dismiss(loadingToast);
        // toast.success('Account created successfully! 🎉');
        
        navigate('/login', { 
          state: { message: 'Registration successful! Please sign in.' }
        });
      } else {
        toast.dismiss(loadingToast);
        
        const errorData = result.error || {};
        
        if (errorData.username) {
          toast.error(`Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}`);
        }
        if (errorData.email) {
          toast.error(`Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`);
        }
        if (errorData.password) {
          toast.error(`Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}`);
        }
        if (errorData.non_field_errors) {
          errorData.non_field_errors.forEach(error => {
            toast.error(error);
          });
        }
        
        if (!errorData.username && !errorData.email && !errorData.password && !errorData.non_field_errors) {
          toast.error('Registration failed. Please check your information.');
        }
        
        setErrors(errorData);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className="input-field mt-1"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name[0]}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className="input-field mt-1"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name[0]}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
              )}
            </div>

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
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Confirm your password"
                value={formData.password_confirm}
                onChange={handleChange}
              />
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirm[0]}</p>
              )}
            </div>
          </div>

          {errors.non_field_errors && (
            <div className="text-red-600 text-sm text-center">
              {errors.non_field_errors[0]}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;