import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 2000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 2000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
        error: {
          duration: 2000,
          style: {
            background: '#ff4444',
            color: '#fff',
          },
        },
        loading: {
          duration: Infinity,
        },
      }}
    />
  </StrictMode>,
)