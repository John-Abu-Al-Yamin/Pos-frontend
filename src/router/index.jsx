import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/pages/auth/LoginForm";
import Dashboard from "@/pages/dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import CategoryPage from "@/pages/categories/CategoryPage";
import CategoryPageDetalis from "@/pages/categories/CategoryPageDetalis";
import AddCategories from "@/pages/categories/AddCategories";

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
      {
        path: "",
        element: <Dashboard />,
      },

      {
        path: "/categories",
        element: <CategoryPage />,
      },
      {
        path: "/categories/:id",
        element: <CategoryPageDetalis />,
      },
      {
        path: "/categories/add",
        element: <AddCategories />,
      },
      // {
      //   path: "/categories/edit/:id",
      //   element: <AddCategories />,
      // },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default router;
