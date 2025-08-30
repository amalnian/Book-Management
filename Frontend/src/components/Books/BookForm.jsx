import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { booksAPI } from '../../endpoints/Api';

const BookForm = ({ isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    genre: '',
    publication_date: '',
    description: '',
    isbn: '',
    pages: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  const navigate = useNavigate();
  const { id } = useParams();

  const genres = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non_fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci_fi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'biography', label: 'Biography' },
    { value: 'history', label: 'History' },
    { value: 'self_help', label: 'Self Help' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (isEditing && id) {
      fetchBook();
    }
  }, [isEditing, id]);

  const fetchBook = async () => {
    try {
      setInitialLoading(true);
      const response = await booksAPI.getBook(id);
      const book = response.data;
      setFormData({
        title: book.title,
        authors: book.authors,
        genre: book.genre,
        publication_date: book.publication_date,
        description: book.description || '',
        isbn: book.isbn || '',
        pages: book.pages || '',
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/books');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Show loading toast
    const loadingToast = toast.loading(
      isEditing ? 'Updating book...' : 'Creating book...'
    );

    try {
      const submitData = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : null,
      };

      if (isEditing) {
        await booksAPI.updateBook(id, submitData);
        toast.success('Book updated successfully!', { id: loadingToast });
      } else {
        await booksAPI.createBook(submitData);
        toast.success('Book created successfully!', { id: loadingToast });
      }
      
      navigate('/books');
    } catch (error) {
      toast.error(
        isEditing ? 'Failed to update book' : 'Failed to create book',
        { id: loadingToast }
      );
      setErrors(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field mt-1"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
            Authors * (comma-separated if multiple)
          </label>
          <input
            type="text"
            id="authors"
            name="authors"
            required
            className="input-field mt-1"
            placeholder="e.g., J.K. Rowling, Stephen King"
            value={formData.authors}
            onChange={handleChange}
          />
          {errors.authors && (
            <p className="mt-1 text-sm text-red-600">{errors.authors[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre *
          </label>
          <select
            id="genre"
            name="genre"
            required
            className="input-field mt-1"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
          {errors.genre && (
            <p className="mt-1 text-sm text-red-600">{errors.genre[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700">
            Publication Date *
          </label>
          <input
            type="date"
            id="publication_date"
            name="publication_date"
            required
            className="input-field mt-1"
            value={formData.publication_date}
            onChange={handleChange}
          />
          {errors.publication_date && (
            <p className="mt-1 text-sm text-red-600">{errors.publication_date[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              className="input-field mt-1"
              placeholder="10 or 13 digits"
              value={formData.isbn}
              onChange={handleChange}
            />
            {errors.isbn && (
              <p className="mt-1 text-sm text-red-600">{errors.isbn[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
              Pages
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              min="1"
              className="input-field mt-1"
              value={formData.pages}
              onChange={handleChange}
            />
            {errors.pages && (
              <p className="mt-1 text-sm text-red-600">{errors.pages[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="input-field mt-1"
            placeholder="Brief description of the book..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Book' : 'Create Book')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;