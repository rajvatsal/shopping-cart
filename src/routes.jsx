import ProductPage from './ShoppingCart-App/product-page/Page.jsx'
import Index from './ShoppingCart-App/IndexPage.jsx'
import CartPage from './ShoppingCart-App/cart-page/Page.jsx'
import App from './ShoppingCart-App/App.jsx'
import { ScrollRestoration, Outlet } from 'react-router'

const AppLayout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
  </>
)

const routes = [
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
