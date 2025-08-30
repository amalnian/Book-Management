import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { booksAPI } from '../../endpoints/Api';
import BookCard from './BookCard';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');

  const genres = [
    { value: '', label: 'All Genres' },
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
    fetchBooks();
  }, [searchTerm, selectedGenre, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        genre: selectedGenre || undefined,
        ordering: sortBy,
      };
      const response = await booksAPI.getBooks(params);
      setBooks(response.data.results || response.data);
      
      if (searchTerm || selectedGenre) {
        const resultCount = (response.data.results || response.data).length;
        toast.success(`Found ${resultCount} book${resultCount !== 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        toast(
          (t) => (
            <div>
              <p className="font-medium">Delete "{bookTitle}"?</p>
              <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
            style: {
              background: '#fff',
              color: '#333',
            },
          }
        );
      });
    };

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    const loadingToast = toast.loading('Deleting book...');
    
    try {
      await booksAPI.deleteBook(bookId);
      toast.success('Book deleted successfully', { id: loadingToast });
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book', { id: loadingToast });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Books</h1>
        <Link
          to="/books/create"
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Book
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search books..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="input-field"
        >
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field"
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="-title">Title Z-A</option>
          <option value="publication_date">Publication Date (Old-New)</option>
          <option value="-publication_date">Publication Date (New-Old)</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found</p>
          <Link to="/books/create" className="btn-primary mt-4">
            Add the first book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onUpdate={fetchBooks}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;