import "./App.css";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/ManageOrders";
import EditProduct from "./pages/EditProduct";
import Profile from "./components/Profile";
import MerchantDashboard from "./pages/MerchantDashboard";
import MyOrders from "./pages/MyOrders";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import MerchantRoute from "./components/MerchantRoute";
import ConsumerRoute from "./components/ConsumerRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AppContextProvider from "./contexts/AppContextProvider";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <ErrorBoundary>
      <AppContextProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout showHeader={true}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout showHeader={true}>
                <Products />
              </Layout>
            }
          />
          <Route
            path="/add-product"
            element={
              <MerchantRoute>
                <Layout showHeader={true}>
                  <AddProduct />
                </Layout>
              </MerchantRoute>
            }
          />
          <Route
            path="/merchant-dashboard"
            element={
              <MerchantRoute>
                <Layout showHeader={true}>
                  <MerchantDashboard />
                </Layout>
              </MerchantRoute>
            }
          />
          <Route
            path="/manage-products"
            element={
              <MerchantRoute>
                <Layout showHeader={true}>
                  <ManageProducts />
                </Layout>
              </MerchantRoute>
            }
          />
          <Route
            path="/manage-orders"
            element={
              <MerchantRoute>
                <Layout showHeader={true}>
                  <ManageOrders />
                </Layout>
              </MerchantRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <MerchantRoute>
                <Layout showHeader={true}>
                  <EditProduct />
                </Layout>
              </MerchantRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ConsumerRoute>
                <Layout showHeader={true}>
                  <Cart />
                </Layout>
              </ConsumerRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ConsumerRoute>
                <Layout showHeader={true}>
                  <MyOrders />
                </Layout>
              </ConsumerRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout showHeader={true}>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <Layout showHeader={false}>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout showHeader={false}>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout showHeader={false}>
                <Login />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout showHeader={true}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center p-8">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">
                      404
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-6">
                      Page Not Found
                    </h2>
                    <p className="text-gray-500 mb-8">
                      The page you're looking for doesn't exist.
                    </p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Go Back Home
                    </Link>
                  </div>
                </div>
              </Layout>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 2000,
              style: {
                background: "#10B981",
                color: "#fff",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#EF4444",
                color: "#fff",
              },
            },
          }}
        />
      </AppContextProvider>
    </ErrorBoundary>
  );
}

export default App;
