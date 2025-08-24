import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';

const AppContextProvider = ({ children }) => {
  return (
    <ProductProvider>
      <CartProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </CartProvider>
    </ProductProvider>
  );
};

export default AppContextProvider;
