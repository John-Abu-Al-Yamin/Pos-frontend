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
import PurchaseHeaderPage from "@/pages/PurchaseHeaders/PurchaseHeaderPage";
import AddPurchaseHeader from "@/pages/PurchaseHeaders/AddPurchaseHeader";
import UpdatePurchaseHeader from "@/pages/PurchaseHeaders/UpdatePurchaseHeader";
import DetlaisPurchaseHeader from "@/pages/PurchaseHeaders/DetlaisPurchaseHeader";
import AddPurchaseItem from "@/pages/PurchaseItem/AddPurchaseItem";
import UpdatePurchaseItem from "@/pages/PurchaseItem/UpdatePurchaseItem";
import UsedDevicePurchaseHeaderPage from "@/pages/UsedDevicePurchaseHeaders/UsedDevicePurchaseHeaderPage";
import AddUsedDevicePurchaseHeader from "@/pages/UsedDevicePurchaseHeaders/AddUsedDevicePurchaseHeader";
import UpdateUsedDevicePurchaseHeader from "@/pages/UsedDevicePurchaseHeaders/UpdateUsedDevicePurchaseHeader";
import DetlaisUsedDevicePurchaseHeader from "@/pages/UsedDevicePurchaseHeaders/DetlaisUsedDevicePurchaseHeader";
import AddUsedDevicePurchaseItem from "@/pages/UsedDevicePurchaseItem/AddUsedDevicePurchaseItem";
import UpdateUsedDevicePurchaseItem from "@/pages/UsedDevicePurchaseItem/UpdateUsedDevicePurchaseItem";
import PosPage from "@/pages/Pos/PosPage";
import MarkupSettingsPage from "@/pages/markupSettings/MarkupSettingsPage";
import SalesHeaderPage from "@/pages/SalesHeaders/SalesHeaderPage";
import DetlaisSalesHeader from "@/pages/SalesHeaders/DetlaisSalesHeader";
import SalesReturnHeaderPage from "@/pages/SalesReturnHeaders/SalesReturnHeaderPage";
import DetlaisSalesReturnHeader from "@/pages/SalesReturnHeaders/DetlaisSalesReturnHeader";
import SalesReturnablePage from "@/pages/SalesReturnable/SalesReturnablePage";
import ReturnableInvoiceItems from "@/pages/SalesReturnable/ReturnableInvoiceItems";
import PurchaseReturnablePage from "@/pages/PurchaseReturnable/PurchaseReturnablePage";
import ReturnablePurchaseInvoiceItems from "@/pages/PurchaseReturnable/ReturnablePurchaseInvoiceItems";
import PurchaseReturnHeaderPage from "@/pages/PurchaseReturnHeaders/PurchaseReturnHeaderPage";
import DetlaisPurchaseReturnHeader from "@/pages/PurchaseReturnHeaders/DetlaisPurchaseReturnHeader";
import MaintenanceTicketsPage from "@/pages/MaintenanceTickets/MaintenanceTicketsPage";
import AddMaintenanceTicket from "@/pages/MaintenanceTickets/AddMaintenanceTicket";
import UpdateMaintenanceTicket from "@/pages/MaintenanceTickets/UpdateMaintenanceTicket";
import DetlaisMaintenanceTicket from "@/pages/MaintenanceTickets/DetlaisMaintenanceTicket";
import AddMaintenanceOperation from "@/pages/MaintenanceOperations/AddMaintenanceOperation";
import UpdateMaintenanceOperation from "@/pages/MaintenanceOperations/UpdateMaintenanceOperation";
import AddMaintenanceUsedPart from "@/pages/MaintenanceSpareParts/AddMaintenanceSparePart";
import UpdateMaintenanceUsedPart from "@/pages/MaintenanceSpareParts/UpdateMaintenanceSparePart";

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
        path: "/",
        element: <h1>dashboard</h1>,
      },

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

      // settings Routes
      {
        path: "/settings",
        element: <MarkupSettingsPage />,
      },

      // products Routes
      {
        path: "/products",
        element: <ProductPage />,
      },

      // PurchaseHeader
      {
        path: "/purchase-headers",
        element: <PurchaseHeaderPage />,
      },

      {
        path: "/purchase-headers/add",
        element: <AddPurchaseHeader />,
      },
      {
        path: "/purchase-headers/update/:id",
        element: <UpdatePurchaseHeader />,
      },
      {
        path: "/purchase-headers/details/:id",
        element: <DetlaisPurchaseHeader />,
      },

      // Purchase Item
      {
        path: "/purchase-item/add/:id",
        element: <AddPurchaseItem />,
      },

      {
        path: "/purchase-item/update/:id",
        element: <UpdatePurchaseItem />,
      },

      // UsedDevicePurchaseHeader
      {
        path: "/used-purchase-headers",
        element: <UsedDevicePurchaseHeaderPage />,
      },

      {
        path: "/used-purchase-headers/add",
        element: <AddUsedDevicePurchaseHeader />,
      },
      {
        path: "/used-purchase-headers/update/:id",
        element: <UpdateUsedDevicePurchaseHeader />,
      },
      {
        path: "/used-purchase-headers/details/:id",
        element: <DetlaisUsedDevicePurchaseHeader />,
      },

      // Used Device Purchase Item
      {
        path: "/used-purchase-item/add/:id",
        element: <AddUsedDevicePurchaseItem />,
      },

      {
        path: "/used-purchase-item/update/:id",
        element: <UpdateUsedDevicePurchaseItem />,
      },

      // POS / Sales
      {
        path: "/pos",
        element: <PosPage />,
      },

      {
        path: "/sales-headers",
        element: <SalesHeaderPage />,
      },

      {
        path: "/sales-headers/details/:id",
        element: <DetlaisSalesHeader />,
      },

      // Sales Return Routes
      {
        path: "/sales-returns",
        element: <SalesReturnHeaderPage />,
      },


      {
        path: "/sales-returns/details/:id",
        element: <DetlaisSalesReturnHeader />,
      },

      // Sales Returnable Routes
      {
        path: "/sales-returnable",
        element: <SalesReturnablePage />,
      },

      {
        path: "/sales-returnable/:id",
        element: <ReturnableInvoiceItems />,
      },

      // Purchase Return Routes
      {
        path: "/purchase-returns",
        element: <PurchaseReturnHeaderPage />,
      },

      {
        path: "/purchase-returns/details/:id",
        element: <DetlaisPurchaseReturnHeader />,
      },

      // Purchase Returnable Routes
      {
        path: "/purchase-returnable",
        element: <PurchaseReturnablePage />,
      },

      {
        path: "/purchase-returnable/:id",
        element: <ReturnablePurchaseInvoiceItems />,
      },

      // Maintenance Tickets Routes
      {
        path: "/maintenance-tickets",
        element: <MaintenanceTicketsPage />,
      },

      {
        path: "/maintenance-tickets/add",
        element: <AddMaintenanceTicket />,
      },

      {
        path: "/maintenance-tickets/update/:id",
        element: <UpdateMaintenanceTicket />,
      },

      {
        path: "/maintenance-tickets/details/:id",
        element: <DetlaisMaintenanceTicket />,
      },

      // Maintenance Operations Routes
      {
        path: "/maintenance-operations/add/:id",
        element: <AddMaintenanceOperation />,
      },

      {
        path: "/maintenance-operations/update/:id",
        element: <UpdateMaintenanceOperation />,
      },

      // Maintenance Used Parts Routes
      {
        path: "/maintenance-used-parts/add/:id",
        element: <AddMaintenanceUsedPart />,
      },

      {
        path: "/maintenance-used-parts/update/:id",
        element: <UpdateMaintenanceUsedPart />,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default router;
