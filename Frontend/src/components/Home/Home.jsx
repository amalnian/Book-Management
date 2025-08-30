import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ListBulletIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      name: 'Manage Books',
      description: 'Upload, organize, and browse through a vast collection of books.',
      icon: BookOpenIcon,
      href: '/books',
    },
    {
      name: 'Reading Lists',
      description: 'Create personalized reading lists and track your reading journey.',
      icon: ListBulletIcon,
      href: '/reading-lists',
    },

  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Your Digital</span>
                <span className="block text-blue-200">Book Manager</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-blue-100 sm:max-w-3xl">
                Organize your books, create reading lists, and discover new favorites all in one place.
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                  {user ? (
                    <>
                      <Link
                        to="/books"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8"
                      >
                        Browse Books
                      </Link>
                      <Link
                        to="/reading-lists"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                      >
                        My Lists
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/login"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your books
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              From organizing your collection to tracking your reading progress, we've got you covered.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
            <div className="relative">
              <dl className="space-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                    {user && (
                      <dd className="mt-3 ml-16">
                        <Link
                          to={feature.href}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          Explore →
                        </Link>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {!user && (
        <div className="bg-blue-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Create your account today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Join thousands of book lovers who are already using BookManager to organize their reading.
            </p>
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;