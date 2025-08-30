import api from "../axiosinterceptor/UserInterceptor";
api.defaults.withCredentials = true;

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login/", credentials),
  register: (userData) => api.post("/auth/register/", userData),
  logout: () => api.post("/auth/logout/"),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (userData) => {
    return api.put("/auth/profile/", userData);
  },
  refreshToken: () => api.post("/auth/token/refresh/"),
};

// Books APIs
export const booksAPI = {
  getBooks: (params) => api.get("/book/", { params }),
  getBook: (id) => api.get(`/book/${id}/`),
  createBook: (bookData) => api.post("/book/", bookData),
  updateBook: (id, bookData) => api.put(`/book/${id}/`, bookData),
  deleteBook: (id) => api.delete(`/book/${id}/`),
};

// Reading Lists APIs
export const readingListsAPI = {
  getLists: () => api.get("/reading-list/"),
  getList: (id) => api.get(`/reading-list/${id}/`),
  createList: (listData) => api.post("/reading-list/", listData),
  updateList: (id, listData) => api.put(`/reading-list/${id}/`, listData),
  deleteList: (id) => api.delete(`/reading-list/${id}/`),
  addBookToList: (listId, bookData) =>
    api.post(`/reading-list/${listId}/add-book/`, bookData),
  removeBookFromList: (listId, itemId) =>
    api.delete(`/reading-list/${listId}/items/${itemId}/`),
};
