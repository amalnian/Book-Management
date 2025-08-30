import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { booksAPI } from '../../endpoints/Api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBook(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        let toastId;
        
        toastId = toast.custom(
          (t) => (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200 max-w-md">
              <div className="flex items-center mb-4">
                <TrashIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
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
      const loadingToast = toast.loading('Deleting book...');

      await booksAPI.deleteBook(book.id);

      toast.dismiss(loadingToast);
      toast.success(`"${book.title}" has been deleted successfully! 🗑️`);

      navigate('/books');
    } catch (error) {
      console.error('Error deleting book:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this book');
      } else if (error.response?.status === 404) {
        toast.error('Book not found');
      } else {
        toast.error('Failed to delete book');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
          <Link
            to="/books"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user && user.id === book.created_by;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/books"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Books
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {book.cover_image && (
            <div className="md:w-1/3">
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>
          )}
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              
              {canEdit && (
                <div className="flex space-x-2">
                  <Link
                    to={`/books/${book.id}/edit`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Author</h3>
                <p className="text-gray-600">{book.authors}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Genre</h3>
                <p className="text-gray-600 capitalize">{book.genre.replace('_', ' ')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Publication Date</h3>
                <p className="text-gray-600">
                  {new Date(book.publication_date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ISBN</h3>
                <p className="text-gray-600">{book.isbn || 'Not available'}</p>
              </div>

              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Added on {new Date(book.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;