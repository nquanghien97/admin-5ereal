import { useEffect } from 'react';
import './App.css'
import { useUserStore } from './zustand/user.store';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const { getMe } = useUserStore()

  useEffect(() => {
    document.title = "5EREAL Admin"
  }, []);

  useEffect(() => {
    (async () => {
      await getMe()
    })()
  }, [getMe])
  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  )
}

export default App
