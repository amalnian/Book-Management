import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, BookOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import { readingListsAPI } from '../../endpoints/Api';
import toast from 'react-hot-toast';

const ReadingListsList = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await readingListsAPI.getLists();
      setLists(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching reading lists:', error);
      toast.error('Failed to load reading lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listId, listName) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        let toastId;
        
        toastId = toast.custom(
          (t) => (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200 max-w-md">
              <div className="flex items-center mb-4">
                <TrashIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Reading List</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to delete "{listName}"? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    toast.dismiss(toastId);
                    resolve(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(toastId);
                    resolve(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
            position: 'top-center',
          }
        );
      });
    };

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    try {
      setDeleting(true);
      const loadingToast = toast.loading('Deleting reading list...');

      await readingListsAPI.deleteList(listId);

      toast.dismiss(loadingToast);
      toast.success(`"${listName}" has been deleted successfully! 🗑️`);

      fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this list');
      } else if (error.response?.status === 404) {
        toast.error('Reading list not found');
      } else {
        toast.error('Failed to delete reading list');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reading lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Reading Lists</h1>
        <Link
          to="/reading-lists/create"
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create List
        </Link>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reading lists</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new reading list.</p>
          <div className="mt-6">
            <Link to="/reading-lists/create" className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create List
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{list.name}</h3>
                <button
                  onClick={() => handleDelete(list.id, list.name)}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              
              {list.description && (
                <p className="text-gray-600 mb-4">{list.description}</p>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{list.items_count || 0} books</span>
                <span>{list.is_public ? 'Public' : 'Private'}</span>
              </div>
              
              <Link
                to={`/reading-lists/${list.id}`}
                className="btn-primary w-full text-center"
              >
                View List
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingListsList;