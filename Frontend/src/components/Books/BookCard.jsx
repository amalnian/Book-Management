// Updated BookCard.js component with toast
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { booksAPI } from '../../endpoints/Api';
import toast from 'react-hot-toast';

const BookCard = ({ book, onUpdate }) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    // Custom confirmation toast
    const confirmDelete = () => {
      return new Promise((resolve) => {
        toast.custom((t) => (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200 max-w-md">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Book</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to delete "{book.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ), {
          duration: Infinity,
          position: 'top-center',
        });
      });
    };

    const shouldDelete = await confirmDelete();
    
    if (!shouldDelete) return;

    try {
      setDeleting(true);
      
      // Show loading toast
      const loadingToast = toast.loading('Deleting book...');
      
      await booksAPI.deleteBook(book.id);
      
      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success(`"${book.title}" has been deleted successfully! 🗑️`);
      
      // Update the book list
      onUpdate();
      
    } catch (error) {
      console.error('Error deleting book:', error);
      
      // Handle different types of errors
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this book');
      } else if (error.response?.status === 404) {
        toast.error('Book not found');
      } else {
        toast.error('Failed to delete book. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const canEdit = user && user.id === book.created_by;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {book.cover_image && (
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {book.title}
          </h3>
          {canEdit && (
            <Menu as="div" className="relative">
              <Menu.Button className="text-gray-400 hover:text-gray-600">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/books/${book.id}/edit`}
                          className={`${
                            active ? 'bg-blue-500 text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() => toast.loading('Loading book for editing...')}
                        >
                          <PencilIcon className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className={`${
                            active ? 'bg-red-500 text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm disabled:opacity-50`}
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-2">by {book.authors}</p>
        <p className="text-xs text-gray-500 mb-2 capitalize">{book.genre.replace('_', ' ')}</p>
        
        {book.description && (
          <p className="text-sm text-gray-700 line-clamp-3 mb-3">
            {book.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(book.publication_date).getFullYear()}
          </span>
          <Link
            to={`/books/${book.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;