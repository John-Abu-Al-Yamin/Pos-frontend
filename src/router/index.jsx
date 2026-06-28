import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/pages/auth/LoginForm";
import Dashboard from "@/pages/dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import CategoryPage from "@/pages/categories/CategoryPage";
import ProductPage from "@/pages/Product/ProductPage";
import SuppliersPage from "@/pages/suppliers/SuppliersPage";
import PurchasesPage from "@/pages/purchases/purchasesPage";
import PurchasesAdd from "@/pages/purchases/PurchasesAdd";
import PurchasesEdit from "@/pages/purchases/PurchasesEdit";
import PurchasesDetails from "@/pages/purchases/PurchasesDetails";
import PurchaseItemEdit from "@/pages/purchases/PurchaseItemEdit";
import PurchaseItemDetails from "@/pages/purchases/PurchaseItemDetails";
import CustomersPage from "@/pages/customers/CustomersPage";
import StockPage from "@/pages/Stock/StockPage";
import StockDetails from "@/pages/Stock/StockDetails";
import SalesPage from "@/pages/sales/SalesPage";
import SaleDetails from "@/pages/sales/SaleDetails";
import CreateReturn from "@/pages/sales/CreateReturn";
import ReturnsPage from "@/pages/returns/ReturnsPage";
import ReturnDetails from "@/pages/returns/ReturnDetails";
import PosPage from "@/pages/pos/PosPage";
import RepairsPage from "@/pages/repairs/RepairsPage";
import ExpensesPage from "@/pages/expenses/ExpensesPage";
import RepairAdd from "@/pages/repairs/RepairAdd";
import RepairDetails from "@/pages/repairs/RepairDetails";
import RepairEdit from "@/pages/repairs/RepairEdit";

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
        path: "dashboard",
        element: <StockPage />,
      },

      // dashboard Routes
      {
        path: "/",
        element: <Dashboard />,
      },

      // categories Routes
      {
        path: "/categories",
        element: <CategoryPage />,
      },

      // {
      //   path: "/categories/edit/:id",
      //   element: <AddCategories />,
      // },

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

      // sales Routes
      {
        path: "/sales",
        element: <SalesPage />,
      },
      {
        path: "/sales/:id",
        element: <SaleDetails />,
      },
      {
        path: "/sales/:id/return",
        element: <CreateReturn />,
      },

      // returns Routes
      {
        path: "/returns",
        element: <ReturnsPage />,
      },
      {
        path: "/returns/:id",
        element: <ReturnDetails />,
      },

      // pos Routes
      {
        path: "/pos",
        element: <PosPage />,
      },

      // expenses Routes
      {
        path: "/expenses",
        element: <ExpensesPage />,
      },

      // repairs Routes
      {
        path: "/repairs",
        element: <RepairsPage />,
      },
      {
        path: "/repairs/add",
        element: <RepairAdd />,
      },
      {
        path: "/repairs/:id",
        element: <RepairDetails />,
      },
      {
        path: "/repairs/edit/:id",
        element: <RepairEdit />,
      },

      // stock Routes
      {
        path: "/stock/:id",
        element: <StockDetails />,
      },

      // purchases Routes
      {
        path: "/purchases",
        element: <PurchasesPage />,
      },
      {
        path: "/purchases/add",
        element: <PurchasesAdd />,
      },
      {
        path: "/purchases/edit/:id",
        element: <PurchasesEdit />,
      },
      {
        path: "/purchases/:id",
        element: <PurchasesDetails />,
      },
      {
        path: "/purchases/:purchaseId/items/:itemId",
        element: <PurchaseItemDetails />,
      },
      {
        path: "/purchases/:purchaseId/items/:itemId/edit",
        element: <PurchaseItemEdit />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default router;
