import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../Frontend/src/contexts/AuthContext';
import Layout from '../../Frontend/src/components/Layout/Layout';
import ProtectedRoute from '../src/components/ProtectedRoute';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Book Components
import BookList from './components/Books/BookList';
import BookForm from './components/Books/BookForm';
import BookDetail from './components/Books/BookDetail'; // Add this import

// Reading List Components
import ReadingListsList from './components/ReadingLists/ReadingListsList';
import ReadingListDetail from './components/ReadingLists/ReadingListDetail';
import ReadingListForm from './components/ReadingLists/ReadingListForm';

// Other Components
import Home from './components/Home/Home';
import Profile from './components/Home/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/create"
              element={
                <ProtectedRoute>
                  <BookForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id"
              element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute>
                  <BookForm isEditing={true} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading-lists"
              element={
                <ProtectedRoute>
                  <ReadingListsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading-lists/create"
              element={
                <ProtectedRoute>
                  <ReadingListForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading-lists/:id"
              element={
                <ProtectedRoute>
                  <ReadingListDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading-lists/:id/edit"
              element={
                <ProtectedRoute>
                  <ReadingListForm isEditing={true} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;