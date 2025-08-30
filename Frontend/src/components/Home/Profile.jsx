import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../endpoints/Api";
import toast from 'react-hot-toast';
import {
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    profile_picture: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePicture(file);
    
    if (file) {
      toast.success(`Selected: ${file.name}`, {
        icon: '📎',
        duration: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const loadingToast = toast.loading('Updating profile...');

    try {
      const hasProfilePicture = newProfilePicture instanceof File;
      
      let response;
      
      if (hasProfilePicture) {
        const formData = new FormData();
        
        formData.append('username', profileData.username || '');
        formData.append('first_name', profileData.first_name || '');
        formData.append('last_name', profileData.last_name || '');
        formData.append('bio', profileData.bio || '');
        
        formData.append('profile_picture', newProfilePicture);
        
        console.log('Sending FormData with file:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'FILE - ' + pair[1].name : pair[1]));
        }
        
        response = await authAPI.updateProfile(formData);
      } else {
        const jsonData = {
          username: profileData.username,
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          bio: profileData.bio || ''
        };
        
        console.log('Sending JSON data:', jsonData);
        
        response = await authAPI.updateProfile(jsonData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      setProfileData(response.data);
      toast.success("Profile updated successfully!", { 
        id: loadingToast,
        duration: 3000,
        icon: '✅',
      });
      setIsEditing(false);
      setNewProfilePicture(null);

      if (updateUser) updateUser(response.data);

      setError("");
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.profile_picture?.[0] || 
                          err.response?.data?.detail || 
                          "Failed to update profile. Please try again.";
      
      toast.error(errorMessage, { 
        id: loadingToast,
        duration: 4000,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewProfilePicture(null);
    setError("");
    setSuccess("");
    
    if (user) {
      setProfileData(user);
    }
    
    toast('Changes cancelled', {
      icon: '↩️',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">
                {profileData.username}
              </h1>
              <p className="text-blue-100">{profileData.email}</p>
            </div>
          </div>

          <div className="mt-6 sm:mt-0">
            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  toast('Edit mode enabled', {
                    icon: '✏️',
                    duration: 2000,
                  });
                }}
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={profileData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 flex items-center text-gray-600">
                    <span className="mr-2">👤</span>
                    {profileData.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={profileData.first_name || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 flex items-center text-gray-600">
                    <span className="mr-2">👤</span>
                    {profileData.first_name || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={profileData.last_name || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 flex items-center text-gray-600">
                    <span className="mr-2">👤</span>
                    {profileData.last_name || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <p className="mt-1 flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  {profileData.email}
                </p>
              </div>
            </div>

            {isEditing && (
              <div>
                <label
                  htmlFor="profile_picture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profile_picture"
                  id="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {newProfilePicture && (
                  <p className="mt-2 text-sm text-green-600">
                    📎 {newProfilePicture.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  id="bio"
                  rows="3"
                  value={profileData.bio || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-gray-600">
                  {profileData.bio || "No bio provided"}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}