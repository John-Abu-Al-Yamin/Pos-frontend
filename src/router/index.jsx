import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/pages/auth/LoginForm";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import CategoryPage from "@/pages/categories/CategoryPage";
import ProductPage from "@/pages/Product/ProductPage";
import SuppliersPage from "@/pages/suppliers/SuppliersPage";
import CustomersPage from "@/pages/customers/CustomersPage";

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

      // products Routes
      {
        path: "/products",
        element: <ProductPage />,
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

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default router;
