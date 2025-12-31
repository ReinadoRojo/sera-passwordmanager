import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: "/",
    Component: null,
  },
  {
    path: "/vault",
    Component: null,
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>,
)
