import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { booksAPI, readingListsAPI } from '../../endpoints/Api';
import toast from 'react-hot-toast';

const AddBookModal = ({ isOpen, onClose, listId, onBookAdded }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchBooks();
    }
  }, [isOpen, searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await booksAPI.getBooks(params);
      setBooks(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookId) => {
    try {
      setAdding(bookId);
      await readingListsAPI.addBookToList(listId, {
        book_id: bookId,
        notes: notes[bookId] || '',
      });
      toast.success('Book added to list successfully!'); 
      onBookAdded();
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book to list'); 
    } finally {
      setAdding(null);
    }
  };

  const handleNotesChange = (bookId, value) => {
    setNotes({
      ...notes,
      [bookId]: value,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4 flex justify-between items-center"
                >
                  Add Book to Reading List
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search books..."
                      className="input-field pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : books.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No books found</p>
                  ) : (
                    <div className="space-y-4">
                      {books.map((book) => (
                        <div key={book.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{book.title}</h4>
                              <p className="text-sm text-gray-600">by {book.authors}</p>
                              <p className="text-xs text-gray-500 capitalize">
                                {book.genre.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <textarea
                              placeholder="Add notes (optional)..."
                              className="w-full text-sm border rounded px-2 py-1 resize-none"
                              rows={2}
                              value={notes[book.id] || ''}
                              onChange={(e) => handleNotesChange(book.id, e.target.value)}
                            />
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => handleAddBook(book.id)}
                              disabled={adding === book.id}
                              className="btn-primary text-sm"
                            >
                              {adding === book.id ? 'Adding...' : 'Add to List'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddBookModal;