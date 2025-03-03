import CartPage from './ShoppingCart-App/pages/CartPage.jsx'
import App from './ShoppingCart-App/App.jsx'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'cart-page',
        element: <CartPage />,
      },
    ],
  },
]

export { routes }
