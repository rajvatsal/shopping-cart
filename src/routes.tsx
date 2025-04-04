import ProductPage from './ShoppingCart-App/product-page/Page.tsx'
import Index from './ShoppingCart-App/IndexPage.tsx'
import CartPage from './ShoppingCart-App/cart-page/Page.tsx'
import App from './ShoppingCart-App/App.tsx'
import { ScrollRestoration, Outlet } from 'react-router'

interface routesObj {
  [key: string]: any
}

const AppLayout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
  </>
)

const routes: routesObj[] = [
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <Index /> },
          {
            path: 'cart-page',
            element: <CartPage />,
          },
          {
            path: 'product/:productId',
            element: <ProductPage />,
          },
        ],
      },
    ],
  },
]

export { routes }
