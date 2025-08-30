import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { readingListsAPI } from '../../endpoints/Api';
import AddBookModal from './AddBookModal';
import toast from 'react-hot-toast';

const ReadingListDetail = () => {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await readingListsAPI.getList(id);
      setList(response.data);
    } catch (error) {
      console.error('Error fetching reading list:', error);
      toast.error('Failed to load reading list');
      navigate('/reading-lists');
    } finally {
      setLoading(false);
    }
  };

  // Custom confirm toast
  const confirmRemove = (onConfirm) => {
    toast((t) => (
      <div className="p-2">
        <p className="text-sm mb-2">Remove this book from the list?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 rounded text-sm"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleRemoveBook = (itemId) => {
    confirmRemove(async () => {
      try {
        await readingListsAPI.removeBookFromList(id, itemId);
        toast.success('Book removed from list'); 
        fetchList();
      } catch (error) {
        console.error('Error removing book:', error);
        toast.error('Failed to remove book');
      }
    });
  };

  const handleBookAdded = () => {
    setShowAddModal(false);
    fetchList();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reading list...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Reading list not found</p>
          <Link to="/reading-lists" className="btn-primary mt-4">
            Back to Lists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{list.name}</h1>
          {list.description && (
            <p className="text-gray-600 text-lg">{list.description}</p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{list.items?.length || 0} books</span>
            <span>{list.is_public ? 'Public' : 'Private'}</span>
            <span>Created {new Date(list.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link
            to={`/reading-lists/${list.id}/edit`}
            className="btn-secondary inline-flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Book
          </button>
        </div>
      </div>

      {list.items?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No books in this list yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add your first book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.items?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.book.cover_image && (
                <img
                  src={item.book.cover_image}
                  alt={item.book.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {item.book.title}
                  </h3>
                  <button
                    onClick={() => handleRemoveBook(item.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">by {item.book.authors}</p>
                <p className="text-xs text-gray-500 mb-2 capitalize">
                  {item.book.genre.replace('_', ' ')}
                </p>
                
                {item.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {item.notes}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    Added {new Date(item.added_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/books/${item.book.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        listId={list.id}
        onBookAdded={handleBookAdded}
      />
    </div>
  );
};

export default ReadingListDetail;
