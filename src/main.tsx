import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routes } from './routes.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.scss'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
