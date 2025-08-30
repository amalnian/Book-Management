import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readingListsAPI } from '../../endpoints/Api';
import toast from 'react-hot-toast';

const ReadingListForm = ({ isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEditing && id) {
      fetchList();
    }
  }, [isEditing, id]);

  const fetchList = async () => {
    try {
      setInitialLoading(true);
      const response = await readingListsAPI.getList(id);
      const list = response.data;
      setFormData({
        name: list.name,
        description: list.description || '',
        is_public: list.is_public,
      });
    } catch (error) {
      console.error('Error fetching reading list:', error);
      toast.error('Failed to load reading list'); 
    window.location.href = '/reading-lists';
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditing) {
        await readingListsAPI.updateList(id, formData);
        toast.success('Reading list updated successfully!');
      } else {
        await readingListsAPI.createList(formData);
        toast.success('Reading list created successfully!'); 
      }
      
      setTimeout(() => {
        navigate('/reading-lists');
      }, 100);
      
    } catch (error) {
      console.error('Error saving reading list:', error);
      setErrors(error.response?.data || {});
      toast.error(isEditing ? 'Failed to update reading list' : 'Failed to create reading list'); 
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reading list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditing ? 'Edit Reading List' : 'Create New Reading List'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            List Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="input-field mt-1"
            placeholder="e.g., Summer Reading, Sci-Fi Favorites"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          )}
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
            placeholder="Describe what this reading list is about..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
          )}
        </div>

        {/* <div className="flex items-center">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.is_public}
            onChange={handleChange}
          />
          <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
            Make this list public (others can view it)
          </label>
        </div> */}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/reading-lists')}
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
              : (isEditing ? 'Update List' : 'Create List')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingListForm;