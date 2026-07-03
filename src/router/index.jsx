import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/pages/auth/LoginForm";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import CategoryPage from "@/pages/categories/CategoryPage";
import SuppliersPage from "@/pages/suppliers/SuppliersPage";
import CustomersPage from "@/pages/customers/CustomersPage";
import BrandsPage from "@/pages/brands/BrandsPage";
import ProductPage from "@/pages/Product/ProductPage";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [{ path: "login", element: <LoginForm /> }],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // categories Routes
      {
        path: "/categories",
        element: <CategoryPage />,
      },

      // suppliers Routes
      {
        path: "/suppliers",
        element: <SuppliersPage />,
      },

      // customers Routes
      {
        path: "/customers",
        element: <CustomersPage />,
      },

      // brands Routes
      {
        path: "/brands",
        element: <BrandsPage />,
      },

      // products Routes
      {
        path: "/products",
        element: <ProductPage />,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default router;
