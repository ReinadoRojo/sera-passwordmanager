import { createBrowserRouter, RouterProvider } from 'react-router'
import { createRoot } from 'react-dom/client'
import AuthPage from './routes/auth'
import VaultPage from './routes/vault'
import './index.css'
import SignupPage from './routes/sign-up'
import { Toaster } from 'sonner'

const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/vault",
    Component: VaultPage,
  }
])

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster position='top-center' />
    <RouterProvider router={router}/>
  </>,
)
