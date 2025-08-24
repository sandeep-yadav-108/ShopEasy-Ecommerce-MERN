import { useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children, showHeader }) => {
  const location = useLocation();
  
  // Use the showHeader prop if provided, otherwise use route-based logic
  const hideHeaderRoutes = ['/login', '/signup'];
  const shouldShowHeader = showHeader !== undefined 
    ? showHeader 
    : !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
};

export default Layout;
