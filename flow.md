# Purchase Flow — POS System (Frontend)

Reference document for the purchase module implementation. Covers both the backend API contract and the frontend architecture built with React 19, React Query, shadcn/ui, and Tailwind CSS v4.

---

## 1. Technology Stack

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Framework          | React 19 (JSX)                                               |
| Build Tool         | Vite 7 (via rolldown)                                        |
| Routing            | react-router-dom v7                                          |
| Data Fetching      | @tanstack/react-query v5 + Devtools                          |
| HTTP Client        | Axios                                                        |
| Forms              | react-hook-form v7 + @hookform/resolvers (Zod)               |
| Validation         | Zod v4                                                       |
| UI Library         | shadcn/ui (Radix primitives)                                 |
| CSS                | Tailwind CSS v4 + `tw-animate-css`                           |
| Icons              | lucide-react                                                 |
| Calendar           | react-day-picker v9 + date-fns                               |
| Toasts             | sonner                                                       |
| i18n               | next-i18next (i18next + react-i18next + i18next-http-backend) |
| Cookies            | js-cookie (`POS_TOKEN`)                                      |
| Animation          | framer-motion                                                |
| Charts             | recharts                                                     |
| Styling            | styled-components, class-variance-authority, tailwind-merge, clsx |

---

## 2. Core Entities & API Endpoints

All endpoints require `Authorization: Bearer <token>` (Sanctum).

| Entity           | Base Endpoint            | Purpose                              |
| ---------------- | ------------------------ | ------------------------------------ |
| Auth Login       | `/login`                 | Authenticate (email + password)      |
| Categories       | `/categories`            | Product groupings (Smartphones, etc) |
| Products         | `/products`              | Catalog items — what you sell        |
| Suppliers        | `/suppliers`             | Who you buy from                     |
| Customers        | `/customers`             | Who you sell to                      |
| Purchase Headers | `/purchase-headers`      | A purchase transaction               |
| Purchase Items   | `/purchase-items`        | Line items within a purchase         |
| Stock Items      | `/stock-items`           | Individual units in inventory        |
| Sales            | `/sales`                 | A sale transaction                   |
| Returns          | `/returns`          | Return/refund transactions           |
| Repairs          | `/repairs`          | Repair/maintenance work orders       |

Base URL: `http://127.0.0.1:8000/api`

All resources follow standard CRUD: `index`, `store`, `show`, `update`, `destroy` (except Stock Items which are read-only, Sales which are read-only after creation with a delete endpoint, and Returns which have no update/delete). Repairs additionally expose `complete` and `cancel` status-transition endpoints.

---

## 3. Entity Details

### 3.1 Category

```json
{
  "id": 1,
  "name": "Smartphones",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

### 3.2 Product

```json
{
  "id": 1,
  "category_id": 1,
  "name": "Samsung Galaxy S25",
  "is_serialized": true,
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

| Field          | Type    | Notes                              |
| -------------- | ------- | ---------------------------------- |
| `is_serialized` | boolean | `true` = mobile (IMEI), `false` = accessory |

### 3.3 Supplier

```json
{
  "id": 1,
  "name": "Samsung Distributor",
  "phone": "01000000000",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

### 3.4 Customer

```json
{
  "id": 1,
  "name": "Ahmed",
  "phone": "01000000000",
  "created_at": "2026-06-24T...",
  "updated_at": "2026-06-24T..."
}
```

> **Note:** The backend `customers` table has only `name` and `phone` columns. The frontend validation schema also includes an `email` field (optional) that is not stored on the backend.

### 3.5 Purchase Header

```json
{
  "id": 1,
  "supplier_id": 1,
  "date": "2026-06-20",
  "total": 135000.00,
  "type": "purchase",
  "reference": "INV-001",
  "reference_code": "REF-001",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

| Field   | Type   | Values                     |
| ------- | ------ | -------------------------- |
| `type`  | string | `purchase` or `opening_stock` |

> **Note:** Purchase headers support soft deletes. The frontend schema also includes `reference` (required text field).

### 3.6 Purchase Item

```json
{
  "id": 1,
  "purchase_header_id": 1,
  "product_id": 1,
  "quantity": 30,
  "unit_cost": 4500.00,
  "line_total": 135000.00,
  "condition": "new",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

| Field       | Type         | Notes                                 |
| ----------- | ------------ | ------------------------------------- |
| `condition` | string       | `new`, `excellent`, `good`, `fair`    |
| `line_total`| decimal      | Calculated server-side as `quantity × unit_cost` |

**Important:** When a purchase item is created, the backend automatically generates one `stock_item` per unit via `StockItemService`:
- **Serialized products** (`is_serialized = true`): each stock item gets a unique serial number (e.g. `SN-0001-20260621-A7X2`).
- **Non-serialized products** (`is_serialized = false`): `serial_number` is `null`.
- **Used serialized products** (condition ≠ `new`): you can optionally send `device_details` — an array of per-unit objects with `battery_health`, `screen_condition`, `body_condition`, `face_id_working`, `fingerprint_working`, `camera_working`, `speaker_working`, `accessories`, and `notes`.

### 3.7 Stock Item

```json
{
  "id": 1,
  "product_id": 1,
  "purchase_item_id": 1,
  "serial_number": "SN-0001-20260621-A7X2",
  "cost_price": 4500.00,
  "condition": "new",
  "status": "available",
  "battery_health": 85,
  "screen_condition": "scratched",
  "body_condition": "good",
  "face_id_working": true,
  "fingerprint_working": null,
  "camera_working": null,
  "speaker_working": null,
  "accessories": "charger, box",
  "notes": "scratches on back",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

| Field                | Type         | Values                                                  |
| -------------------- | ------------ | ------------------------------------------------------- |
| `condition`          | string       | `new`, `excellent`, `good`, `fair`                      |
| `status`             | string       | `available`, `sold`, `reserved`, `damaged`, `returned`, `voided` |
| `battery_health`     | int/null     | 0–100                                                   |
| `screen_condition`   | string/null  | `perfect`, `good`, `scratched`, `cracked`, `broken`     |
| `body_condition`     | string/null  | `perfect`, `good`, `scratched`, `dented`, `worn`       |
| `face_id_working`    | bool/null    | Face ID functionality status                            |
| `fingerprint_working`| bool/null    | Fingerprint sensor status                               |
| `camera_working`     | bool/null    | Camera functionality status                             |
| `speaker_working`    | bool/null    | Speaker functionality status                            |
| `accessories`        | string/null  | e.g. "charger, box, cable"                              |
| `notes`              | string/null  | Additional device-specific notes                        |

### 3.8 Sale

```json
{
  "id": 1,
  "customer_id": 1,
  "user_id": 1,
  "date": "2026-06-24",
  "total": 7500.00,
  "payment_method": "cash",
  "reference_code": "SALE-20260624-0001",
  "created_at": "2026-06-24T...",
  "updated_at": "2026-06-24T..."
}
```

| Field            | Type         | Notes                                |
| ---------------- | ------------ | ------------------------------------ |
| `customer_id`    | int/null     | Optional customer reference          |
| `user_id`        | int/null     | The employee who processed the sale  |
| `payment_method` | string       | cash / card / transfer / installment |
| `reference_code` | string       | Auto-generated by backend            |

### 3.9 Return

```json
{
  "id": 1,
  "sale_id": 1,
  "customer_id": 1,
  "user_id": 1,
  "return_date": "2026-06-26",
  "refund_method": "cash",
  "refund_total": 7500.00,
  "restocking_fee": 0.00,
  "reason": "Defective unit",
  "notes": null,
  "reference_code": "RET-20260626-0001",
  "created_at": "2026-06-26T...",
  "updated_at": "2026-06-26T..."
}
```

| Field            | Type         | Notes                                     |
| ---------------- | ------------ | ----------------------------------------- |
| `sale_id`        | int          | The original sale being returned          |
| `customer_id`    | int/null     | Customer reference                        |
| `user_id`        | int/null     | Employee who processed the return         |
| `return_date`    | date         | Date of return                            |
| `refund_method`  | string       | cash / card / bank_transfer               |
| `refund_total`   | decimal      | Total refunded amount (minus restocking)  |
| `restocking_fee` | decimal      | Optional restocking fee deducted          |
| `reference_code` | string       | Auto-generated (RET-{YYYYMMDD}-{NNNN})    |

### 3.10 Return Item

```json
{
  "id": 1,
  "return_id": 1,
  "sale_item_id": 1,
  "stock_item_id": 1,
  "product_id": 1,
  "quantity": 1,
  "refund_amount": 7500.00,
  "condition_after_inspection": "good",
  "restock": true,
  "reason": "Defective on arrival",
  "notes": null
}
```

| Field                     | Type         | Notes                                                    |
| ------------------------- | ------------ | -------------------------------------------------------- |
| `sale_item_id`            | int          | The original sale line item                              |
| `stock_item_id`           | int/null     | The specific stock item being returned (null for non-serialized) |
| `product_id`              | int          | The product being returned                               |
| `quantity`                | int          | Number of units being returned                           |
| `refund_amount`           | decimal      | Amount refunded for this line item                       |
| `condition_after_inspection` | string/null | `new`, `excellent`, `good`, `fair`, `damaged`          |
| `restock`                 | boolean      | Whether to return to inventory (`available`) or mark `damaged` |

---

## 4. Frontend Architecture

### 4.1 Authentication Flow

1. User submits email + password → `POST /login`
2. On success: Sanctum token stored in cookie `POS_TOKEN` (via `js-cookie`), user object in `localStorage`
3. `ProtectedRoute` checks `checkAuthToken()` → redirects to `/auth/login` if missing
4. `PublicRoute` redirects to `/` if token exists
5. Logout: removes cookie → redirects to `/auth/login`
6. All API requests auto-attach `Bearer <token>` via Axios interceptor (`clientService.js`)

### 4.2 Route Table

| Path | Component | Guard | Layout |
|---|---|---|---|
| `/auth/login` | `LoginForm` | `PublicRoute` | `AuthLayout` |
| `/` | `Dashboard` | `ProtectedRoute` | `MainLayout` |
| `/dashboard` | `StockPage` | `ProtectedRoute` | `MainLayout` |
| `/categories` | `CategoryPage` | `ProtectedRoute` | `MainLayout` |
| `/products` | `ProductPage` | `ProtectedRoute` | `MainLayout` |
| `/suppliers` | `SuppliersPage` | `ProtectedRoute` | `MainLayout` |
| `/customers` | `CustomersPage` | `ProtectedRoute` | `MainLayout` |
| `/purchases` | `PurchasesPage` | `ProtectedRoute` | `MainLayout` |
| `/purchases/add` | `PurchasesAdd` | `ProtectedRoute` | `MainLayout` |
| `/purchases/edit/:id` | `PurchasesEdit` | `ProtectedRoute` | `MainLayout` |
| `/purchases/:id` | `PurchasesDetails` | `ProtectedRoute` | `MainLayout` |
| `/purchases/:purchaseId/items/:itemId` | `PurchaseItemDetails` | `ProtectedRoute` | `MainLayout` |
| `/purchases/:purchaseId/items/:itemId/edit` | `PurchaseItemEdit` | `ProtectedRoute` | `MainLayout` |
| `/repairs` | `RepairsPage` | `ProtectedRoute` | `MainLayout` |
| `/repairs/add` | `RepairAdd` | `ProtectedRoute` | `MainLayout` |
| `/repairs/:id` | `RepairDetails` | `ProtectedRoute` | `MainLayout` |
| `/repairs/edit/:id` | `RepairEdit` | `ProtectedRoute` | `MainLayout` |
| `/sales` | `SalesPage` | `ProtectedRoute` | `MainLayout` |
| `/sales/:id` | `SaleDetails` | `ProtectedRoute` | `MainLayout` |
| `/sales/:id/return` | `CreateReturn` | `ProtectedRoute` | `MainLayout` |
| `/returns` | `ReturnsPage` | `ProtectedRoute` | `MainLayout` |
| `/returns/:id` | `ReturnDetails` | `ProtectedRoute` | `MainLayout` |
| `/pos` | `PosPage` | `ProtectedRoute` | `MainLayout` |
| `/stock/:id` | `StockDetails` | `ProtectedRoute` | `MainLayout` |
| `*` | `ErrorPage` (404) | `ProtectedRoute` | `MainLayout` |

> **Note:** The default route `/` renders `Dashboard`. A secondary `/dashboard` route maps to `StockPage` (likely a misconfiguration — the path label suggests it should be the dashboard, but it renders the stock listing).

### 4.3 React Query CRUD Pattern

Each entity follows a consistent set of custom hooks in `hooks/Actions/`:

| Hook | HTTP | Purpose |
|---|---|---|
| `useGetAll{Entity}(page, limit)` | GET | List with pagination params |
| `useGet{Entity}ById(id)` | GET | Single record |
| `useAdd{Entity}()` | POST | Create |
| `useUpdate{Entity}(id)` | PUT | Update |
| `useDelete{Entity}()` | DELETE | Remove |

Implemented entities: `Categories`, `Product`, `Suppliers`, `PurchaseHeaders`, `PurchaseItems`.

**Additional hooks:**
| Hook | Purpose |
|---|---|
| `useGetAllCustomers`, `useGetCustomersById`, `useAddCustomers`, `useDeleteCustomers` | Customer CRUD (no update hook) |
| `useGetAllSales`, `useGetSaleById`, `useAddSale`, `useGetAvailableStock` | Sales (read-only + create) |
| `useGetAllStock`, `useGetStockById` | Stock items (read-only) |
| `useGetAllReturns`, `useGetReturnById`, `useGetSaleReturnable`, `useAddReturn` | Returns CRUD |
| `useGetAllRepairs`, `useGetRepairById`, `useAddRepair`, `useUpdateRepair(id)`, `useCompleteRepair(id)`, `useCancelRepair(id)`, `useDeleteRepair` | Repairs CRUD with status transitions |
| `useGetAvailableStock(params)` | Queries `GET /stock-items/available` with search/category filters |
| `useGetDashboardData(params)`, `useGetProductsPerformance(params)`, `useGetLowStock()` | Dashboard financial/performance metrics |

### 4.4 API Endpoint Constants

Defined in `hooks/EndPoints/endPoints.js`:

```js
const endPoints = {
  login: "/login",
  categories: "/categories",
  products: "/products",
  suppliers: "/suppliers",
  customers: "/customers",
  sales: "/sales",
  purchaseHeaders: "/purchase-headers",
  purchaseItems: "/purchase-items",
  stockItems: "/stock-items",
  returns: "/returns",
  repairs: "/repairs",
  dashboard: "/dashboard/financial",
  productsPerformance: "/dashboard/products-performance",
  dashboardLowStock: "/dashboard/low-stock",
};
```

### 4.5 Query Keys

Defined in `hooks/EndPoints/queryKeys.js` with individual keys per operation for cache invalidation. Includes keys for `returns`, `addreturns`, `repairs`, `addRepairs`, `updateRepairs`, `dashboard`, `productsPerformance`, and `dashboardLowStock`.

### 4.6 Form & Validation Patterns

All forms use **react-hook-form** with **Zod** schemas via `@hookform/resolvers/zod`.

| Schema | File | Fields | Key Rules |
|---|---|---|---|
| `categorySchema` | `validation/category/category.js` | `name` | min 2 chars, letters only (Arabic/English), no digits |
| `productsSchema` | `validation/products/products.js` | `name`, `category_id`, `is_serialized` | name 1-100 chars, category required, `is_serialized` boolean |
| `suppliersSchema` | `validation/suppliers/suppliers.js` | `name`, `phone` | name min 2, no digits; phone: Egyptian mobile regex `^01[0-2,5]{1}[0-9]{8}$` |
| `purchasesSchema` | `validation/Purchases/Purchases.js` | `supplier_id`, `date`, `reference`, `type` | `supplier_id` required when `type="purchase"`; date required; reference required; type enum |
| `customersSchema` | `validation/customers/customers.js` | `name`, `phone`, `email` | name min 2, no digits; phone optional Egyptian mobile; email optional (not stored on backend) |

**Inline validation** (used in `AddItemModal`, `PurchaseItemEdit`):
- `quantity`: required, min 1
- `unit_cost`: required, min 0
- `condition`: required only for serialized products

### 4.7 Reusable Components

#### Custom (`customs/`)
| Component | Purpose |
|---|---|
| `CustomHeader` | Page header with title, description, action button / modal trigger |
| `AppModalAdd` | Reusable add dialog with loading, error handling, close prevention |
| `AppModalEdite` | Wraps `AppModalAdd` with `submitText="Update"` |
| `AppDeleteModal` | Stub (placeholder) |
| `AddEditHeader` | Page header for add/edit pages with back navigation |
| `InfoCard` | Label-value display card with icon and accent styling |
| `CustomTable` | Stub (placeholder) |
| `CustomPagination` | Pagination controls component |
| `Loading` | Animated loading indicator |
| `LoadingSkeleton` | Skeleton loader (unused) |

#### Feature-specific (`_components/`)
| Component | Used In | Purpose |
|---|---|---|
| `InvoiceInfoCards` | `PurchasesDetails` | Grid of `InfoCard` showing purchase header metadata |
| `InvoiceItemsSection` | `PurchasesDetails` | Table of purchase items with actions + grand total |
| `AddItemModal` | `PurchasesDetails` | Dialog to add a new purchase item |
| `Sidebar` / `SidebarMobil` | `MainLayout` | Desktop sidebar + mobile bottom drawer |
| `Header` | `Dashboard` | Dashboard header bar |
| `QuickActions` | `Dashboard` | Quick action buttons |
| `StatsCards` | `Dashboard` | Stats overview cards |
| `DateFilter` | `Dashboard` | Date range filter (Today/Week/Month/Year/Custom) |
| `LanguageSwitcher` | `MainLayout` | i18n language toggle (commented out in sidebar) |
| `CartPanel` | `PosPage` | POS cart sidebar |
| `CustomerDialog` | `PosPage` | Customer selection dialog |
| `NonSerializedProductCard` | `PosPage` | Accessory selection card |
| `PaymentDialog` | `PosPage` | Payment processing dialog |
| `PrintDialog` | `PosPage` | Receipt print preview |
| `ProductPanel` | `PosPage` | Product grid panel |
| `Receipt` | `PosPage` | Receipt template |
| `ReturnReceipt` | `PosPage` | Return receipt template |
| `SerializedItemRow` | `PosPage` | Individual serialized item in cart |

### 4.8 State Management

- **Server state:** entirely via **@tanstack/react-query** (no Pinia, no Redux)
- **Local UI state:** React `useState` (modal toggles, form state, search)
- **Auth persistence:** cookie (`POS_TOKEN`) + `localStorage` (user object)

---

## 5. Purchase Flow Steps

### Standard Purchase

```
1. Define Category       → POST /categories         (CategoryPage)
2. Define Product        → POST /products            (ProductPage)
3. Define Supplier       → POST /suppliers           (SuppliersPage)
4. Create Purchase Header → POST /purchase-headers   (PurchasesAdd)
5. View Purchase Detail  → GET /purchase-headers/{id}(PurchasesDetails)
6. Add Purchase Items    → POST /purchase-items      (AddItemModal in PurchasesDetails)
7. Stock items generated → Automatic (server-side)
8. Edit/View Items       → PUT/GET /purchase-items/{id} (PurchaseItemEdit / PurchaseItemDetails)
```

### Opening Stock

Same flow, but:
- `type: "opening_stock"` on the purchase header
- `supplier_id` omitted (nullable — `refine` in Zod schema skips the requirement)

---

## 6. UI Screen Details

### 6.1 Stock / Inventory (`/`)
- **Component:** `StockPage`
- Default landing page after login
- Lists all stock items with product, serial number, condition, status, cost price

### 6.2 Stock Details (`/stock/:id`)
- **Component:** `StockDetails`
- Detailed view of a single stock item
- Shows **Device Details** section when device-specific fields are present (battery_health, screen_condition, body_condition, face_id_working, fingerprint_working, camera_working, speaker_working, accessories, notes)

### 6.3 Purchases List (`/purchases`)
- **Component:** `PurchasesPage`
- Table with columns: ID, supplier name, supplier phone, reference, reference_code, date, total, type badge, created_at, actions dropdown
- Actions: View Details, Edit, Deactivate (unwired)
- "Add Purchase" button → `/purchases/add`
- Pagination state ready with `CustomPagination` component

### 6.4 Add Purchase (`/purchases/add`)
- **Component:** `PurchasesAdd`
- Form fields: `supplier_id` (Select), `date` (Calendar Popover), `reference` (text), `type` (card toggle)
- Zod schema: `purchasesSchema`
- On success: navigates to `/purchases`
- Type toggle: two clickable cards — "Purchase" (red) / "Opening Stock" (green)
- Date formatted to `YYYY-MM-DD` before submit

### 6.5 Edit Purchase (`/purchases/edit/:id`)
- **Component:** `PurchasesEdit`
- Pre-populated via `useGetPurchaseHeadersById(id)`
- Same form layout as `PurchasesAdd`
- Uses `initialized` state flag to delay render until `reset()` is called
- Submits via `useUpdatePurchaseHeaders(id)`

### 6.6 Purchase Details (`/purchases/:id`)
- **Component:** `PurchasesDetails`
- Top: `InvoiceInfoCards` — supplier, date, reference, type badge
- Bottom: `InvoiceItemsSection` — item table with product, condition, qty, cost, total, actions
- "Add Item" button → opens `AddItemModal` dialog
- `AddItemModal` shows **Device Details** section (battery health, screen condition, body condition, face_id_working, fingerprint_working, camera_working, speaker_working, accessories, notes) when a serialized product is selected with a used condition
- Device details are sent as `device_details` array (one element per unit) in the API payload
- Live `grandTotal` calculation from line totals
- Item actions: View (`/purchases/:purchaseId/items/:itemId`), Edit (`/.../edit`), Delete (AlertDialog confirm)

### 6.7 Purchase Item Details (`/purchases/:purchaseId/items/:itemId`)
- **Component:** `PurchaseItemDetails`
- Two `InfoCard` sections: Item Information + Invoice Information
- Shows product name, item ID, condition, serialized status, unit cost, quantity, line total, header reference, date, type
- **Device Details** section: appears when stock items have battery health, screen, body, face_id, fingerprint, camera, speaker, accessories, or notes filled in

### 6.8 Edit Purchase Item (`/purchases/:purchaseId/items/:itemId/edit`)
- **Component:** `PurchaseItemEdit`
- Read-only product display with serialized/non-serialized badge
- Editable: `quantity`, `unit_cost`, `condition` (only if serialized)
- Live expected total preview (qty × unit_cost)
- Submits via `useUpdatePurchaseItem(itemId)`
- Device details are not editable through this screen (they are per-stock-item)

### 6.9 Categories (`/categories`)
- **Component:** `CategoryPage`
- Card grid layout (2 cols desktop, 4 cols wide)
- CRUD via modals (AppModalAdd / AppModalEdite)
- Delete via toast confirmation

### 6.10 Products (`/products`)
- **Component:** `ProductPage`
- Card grid layout
- Fields: name, category_id (Select), is_serialized (toggle: "موبايل" / "اكسسوار")
- CRUD via modals

### 6.11 Suppliers (`/suppliers`)
- **Component:** `SuppliersPage`
- Card grid layout
- Fields: name, phone (Egyptian mobile validation)
- CRUD via modals

### 6.12 Customers (`/customers`)
- **Component:** `CustomersPage`
- Card grid layout
- Fields: name, phone (Egyptian mobile validation), email (optional, frontend-only)

### 6.13 Sales List (`/sales`)
- **Component:** `SalesPage`
- Lists all sale transactions

### 6.14 Sale Details (`/sales/:id`)
- **Component:** `SaleDetails`
- Detailed view of a sale with items and stock references

### 6.15 Create Return (`/sales/:id/return`)
- **Component:** `CreateReturn`
- Creates a return from an existing sale
- Select items, quantities, refund method
- Supports serialized (per-unit selection) and non-serialized product returns

### 6.16 Returns List (`/returns`)
- **Component:** `ReturnsPage`
- Lists all return transactions

### 6.17 Return Details (`/returns/:id`)
- **Component:** `ReturnDetails`
- Detailed view of a return with items, refund info, and print support

### 6.18 POS (`/pos`)
- **Component:** `PosPage`
- Point-of-Sale interface
- Composed of `ProductPanel` (product grid with search/filter), `CartPanel` (selected items with quantities), `CustomerDialog` (select/create customer), `PaymentDialog` (payment method + processing), `PrintDialog` (receipt printing)
- Supports serialized (IMEI scan) and non-serialized product entry

---

## 7. Purchase Item Notes

- `line_total` is **not sent** from the client — it is calculated on the backend.
- **Updating** a purchase item propagates changes to `available` stock items only (cost, condition); already-sold units are not retroactively modified.
- **Deleting** a purchase item is blocked if any associated stock items have a non-available status (sold, damaged, etc.). Only items with all `available` stock can be deleted, and only the `available` stock items are hard-deleted.
- When adding an item via `AddItemModal`, `condition` field only shows if the selected product is serialized.
- Non-serialized products automatically display "جديد" (New) in `PurchaseItemEdit`, with the condition field hidden.

---

## 8. Validation Reference

### 8.1 Backend (Laravel)

| Field               | Rules                                                   |
| ------------------- | ------------------------------------------------------- |
| `name` (category)   | `required|string|unique:categories,name`                |
| `name` (product)    | `required|string`                                       |
| `category_id`       | `required`                                              |
| `is_serialized`     | `boolean`                                               |
| `phone` (supplier)  | `required|unique:suppliers,phone`                       |
| `name` (customer)   | `required|string`                                       |
| `phone` (customer)  | `nullable|string|unique:customers,phone`                |
| `supplier_id`       | `nullable|exists:suppliers,id`                          |
| `date`              | `required|date`                                         |
| `type`              | `required|in:purchase,opening_stock`                    |
| `quantity`          | `required|integer|min:1`                                |
| `unit_cost`         | `required|numeric|min:0`                                |
| `condition`         | `nullable|in:new,excellent,good,fair`                   |
| `status`            | `nullable|in:available,sold,reserved,damaged,returned,voided` |
| `serial_number`     | `nullable|string|unique:stock_items,serial_number`      |
| `cost_price`        | `required|numeric|min:0`                                |
| `payment_method`    | `in:cash,card,transfer,installment`                     |
| `device_details`    | `nullable|array`                                        |
| `device_details.*.battery_health` | `nullable|integer|0-100`                   |
| `device_details.*.screen_condition` | `nullable|in:perfect,good,scratched,cracked,broken` |
| `device_details.*.body_condition` | `nullable|in:perfect,good,scratched,dented,worn` |
| `device_details.*.face_id_working` | `nullable|boolean`                  |
| `device_details.*.fingerprint_working` | `nullable|boolean`            |
| `device_details.*.camera_working` | `nullable|boolean`                 |
| `device_details.*.speaker_working` | `nullable|boolean`               |
| `device_details.*.accessories` | `nullable|string|max:500`                   |
| `device_details.*.notes` | `nullable|string|max:1000`                       |
| `battery_health`    | `nullable|integer|0-100`                               |
| `screen_condition`  | `nullable|in:perfect,good,scratched,cracked,broken`    |
| `body_condition`    | `nullable|in:perfect,good,scratched,dented,worn`       |
| `accessories`       | `nullable|string`                                       |
| `notes`             | `nullable|string`                                       |
| `sale items`        | `required|array|min:1`                                  |
| `items.*.product_id` | `required|exists:products,id`                         |
| `items.*.quantity`  | `sometimes|integer|min:1`                               |
| `items.*.unit_price` | `required|numeric|min:0`                              |
| `items.*.stock_item_ids` | `sometimes|array` (for serialized products)       |

### 8.2 Frontend (Zod)

| Schema | Field | Rule |
|---|---|---|
| `categorySchema` | `name` | min 2, letters only (Arabic/English), no digits |
| `productsSchema` | `name` | 1-100 chars |
| `productsSchema` | `category_id` | required string |
| `productsSchema` | `is_serialized` | required boolean |
| `suppliersSchema` | `name` | min 2, no digits (`/^[^\d]+$/`) |
| `suppliersSchema` | `phone` | Egyptian mobile regex (`^01[0-2,5]{1}[0-9]{8}$`) |
| `purchasesSchema` | `supplier_id` | required when `type="purchase"` (via `superRefine`) |
| `purchasesSchema` | `date` | required (not null) |
| `purchasesSchema` | `reference` | required min 1 |
| `purchasesSchema` | `type` | enum `purchase` / `opening_stock` |
| `customersSchema` | `name` | min 2, no digits (`/^[^\d]+$/`) |
| `customersSchema` | `phone` | optional, Egyptian mobile regex |
| `customersSchema` | `email` | optional, valid email (frontend-only, not stored) |
| `repairsSchema` | `device_type` | required string |
| `repairsSchema` | `issue_description` | required string |
| `repairsSchema` | `estimated_cost` | optional number (min 0) |
| `repairsSchema` | `deposit` | optional number (min 0) |
| `repairsSchema` | `parts` | optional array of `{stock_item_id}` |

---

## 9. Known Issues & Leftovers

- **Stock Items page:** Only details view exists (`/stock/:id`); no standalone stock item management page.
- **Route mapping:** `/` renders `Dashboard` (the root route). `/dashboard` renders `StockPage` — the path label suggests it should be the dashboard, but it shows stock instead (likely a misconfiguration).
- **Dashboard data:** `QuickActions` and `StatsCards` contain real-estate themed placeholder content (leftover from a different project). Neither component is actually imported or used by `Dashboard.jsx` — they are orphaned.
- **DateFilter** in `_components/dashboard/` uses hardcoded English labels (`"Today"`, `"This Week"`, etc.) instead of i18n translation keys.
- **PatchRequest bug:** `hooks/handleRequest/PatchRequest.js` uses `method: "POST"` instead of `"PATCH"`.
- **usePatchData bug:** Imports `useAuthContext` from `@/context/AuthContext` which does not exist.
- **useCurdsUsers bug:** References non-existent `@/config/endPoints` and `@/config/queryKes`.
- **Users page:** Not implemented (no route, broken hooks).
- **AppDeleteModal:** Stub component — returns `<div>AppDeleteModal</div>` only, never used.
- **i18n inconsistency:** Desktop sidebar uses hardcoded Arabic; mobile sidebar uses `t("sidebar.*")` translation keys.
- **Header i18n import:** `Header.jsx` imports `useTranslation` from `"next-i18next"` (a Next.js package) instead of `"react-i18next"`, which is inconsistent with the rest of the codebase.
- **Pagination:** `CustomPagination` component exists but integration with entity hooks needs verification.
- **Customer email field:** Frontend Zod schema includes optional `email` field, but the backend `customers` table has no `email` column. The email value is silently dropped.
- **Customer update hook:** Missing `useUpdateCustomers` — only `add` and `delete` hooks exist.
- **Sales immutability:** No update routes for sales; delete exists but requires no associated returns.
- **POS flow:** `PosPage` and supporting components exist with sale and return creation support.
- **i18n extras:** Translation files contain login, forgot-password, OTP, and reset-password keys not backed by any UI component.

---

## 10. File Structure (src/)

```
src/
├── main.jsx                          # Entry point
├── App.jsx                           # Root with TanstackProvider
├── index.css                         # Tailwind v4 + CSS vars + themes
├── i18n.js                           # i18next config
│
├── lib/
│   └── utils.js                      # cn(), formatDate(), formatCurrency() (EGP)
│
├── services/
│   ├── clientService.js              # Axios instance + Bearer token
│   ├── cookies.js                    # js-cookie: POS_TOKEN
│   └── jwt.js                        # Token decode helper
│
├── providers/
│   └── TanstackProvider.jsx          # QueryClientProvider wrapper
│
├── router/
│   ├── index.jsx                     # All route definitions
│   ├── ProtectedRoute.jsx            # Redirect if no token
│   └── PublicRoute.jsx               # Redirect if token exists
│
├── layouts/
│   ├── MainLayout.jsx                # Sidebar + Outlet
│   └── AuthLayout.jsx                # Centered Outlet
│
├── pages/
│   ├── auth/LoginForm.jsx
│   ├── dashboard/Dashboard.jsx
│   ├── categories/CategoryPage.jsx
│   ├── Product/ProductPage.jsx
│   ├── suppliers/SuppliersPage.jsx
│   ├── customers/CustomersPage.jsx
│   ├── sales/
│   │   ├── SalesPage.jsx
│   │   ├── SaleDetails.jsx
│   │   └── CreateReturn.jsx                    (new)
│   ├── repairs/
│   │   ├── RepairsPage.jsx                     (new)
│   │   ├── RepairAdd.jsx                       (new)
│   │   ├── RepairDetails.jsx                   (new)
│   │   └── RepairEdit.jsx                      (new)
│   ├── returns/
│   │   ├── ReturnsPage.jsx                     (new)
│   │   └── ReturnDetails.jsx                   (new)
│   ├── pos/PosPage.jsx
│   ├── Stock/
│   │   ├── StockPage.jsx
│   │   └── StockDetails.jsx
│   └── purchases/
│       ├── purchasesPage.jsx
│       ├── PurchasesAdd.jsx
│       ├── PurchasesEdit.jsx
│       ├── PurchasesDetails.jsx
│       ├── PurchaseItemEdit.jsx
│       ├── PurchaseItemDetails.jsx
│       └── ErrorPage/ErrorPage.jsx
│
├── _components/
│   ├── LanguageSwitcher.jsx
│   ├── Sidebar/Sidebar.jsx, SidebarMobil.jsx
│   ├── dashboard/Header.jsx, QuickActions.jsx, StatsCards.jsx, DateFilter.jsx
│   ├── purchases/
│   │   ├── InvoiceInfoCards.jsx
│   │   ├── InvoiceItemsSection.jsx
│   │   └── AddItemModal.jsx
│   └── pos/
│       ├── CartPanel.jsx
│       ├── CustomerDialog.jsx
│       ├── NonSerializedProductCard.jsx
│       ├── PaymentDialog.jsx
│       ├── PrintDialog.jsx
│       ├── ProductPanel.jsx
│       ├── Receipt.jsx
│       ├── ReturnReceipt.jsx                    (new)
│       └── SerializedItemRow.jsx
│
├── customs/
│   ├── CustomHeader.jsx
│   ├── CustomTable.jsx
│   ├── CustomPagination.jsx
│   ├── AppModalAdd.jsx
│   ├── AppModalEdite.jsx
│   ├── AppDeleteModal.jsx
│   ├── AddEditHeader.jsx
│   ├── InfoCard.jsx
│   ├── Loading.jsx
│   └── LoadingSkeleton.jsx
│
├── components/ui/                    # shadcn/ui primitives
│   ├── alert-dialog.jsx, avatar.jsx, badge.jsx, button.jsx
│   ├── calendar.jsx, card.jsx, dialog.jsx, dropdown-menu.jsx
│   ├── input.jsx, label.jsx, popover.jsx, select.jsx
│   ├── skeleton.jsx, table.jsx, textarea.jsx
│
├── hooks/
│   ├── EndPoints/endPoints.js, queryKeys.js
│   ├── handleRequest/GetRequest.js, PostRequest.js, PutRequest.js, PatchRequest.js, DeleteRequest.js
│   ├── curdsHook/useGetData.jsx, usePostData.jsx, usePutData.jsx, usePatchData.jsx, useDeleteData.jsx
│   ├── Actions/
│   │   ├── auth/useLogin.jsx
│   │   ├── Categories/useCurdsCategories.jsx
│   │   ├── Product/useCurdsProduct.jsx
│   │   ├── suppliers/useCurdsSuppliers.jsx
│   │   ├── customers/useCurdsCustomers.jsx
│   │   ├── dashboard/useCurdsDashboard.jsx             (new)
│   │   ├── returns/useCurdsReturns.jsx                 (new)
│   │   ├── repairs/useCurdsRepairs.jsx                 (new)
│   │   ├── sales/useCurdsSales.jsx
│   │   ├── stock/useCurdsStock.jsx
│   │   ├── PurchaseHeaders/useCurdsPurchaseHeaders.jsx
│   │   ├── PurchaseItems/useCurdsPurchaseItems.jsx
│   │   └── users/useCurdsUsers.jsx   (broken)
│   └── useSearch/useSearch.jsx
│
└── validation/
    ├── category/category.js
    ├── products/products.js
    ├── suppliers/suppliers.js
    ├── customers/customers.js
    └── Purchases/Purchases.js
```

---

## 11. Internationalization

- **Library:** next-i18next (i18next + react-i18next)
- **Backend:** i18next-http-backend (loads `public/locales/{lang}/translation.json`)
- **Detection:** i18next-browser-languagedetector
- **Fallback:** English (`en`)
- **Feature:** `LanguageSwitcher` component toggles between `en` / `ar`; RTL-aware layouts
- **Translation files:**
  - `public/locales/en/translation.json`
  - `public/locales/ar/translation.json`
- **Note:** Translation files contain keys for login, forgot-password, OTP, and reset-password flows that are not backed by UI components. Sidebar keys include real-estate themed entries (`agencies`, `subscriptions`, `leads`, `pro`) not reflected in actual sidebar code.

---

## 12. CRUD Hooks Architecture

```
Request layer (raw HTTP)      →  hooks/handleRequest/*.js
       ↓
Query hook layer (React Query) →  hooks/curdsHook/*.jsx
       ↓
Entity hook layer (Actions)   →  hooks/Actions/{Entity}/*.jsx
       ↓
Page components               →  pages/**/*.jsx
```

Each layer adds:
1. **handleRequest:** Simple Axios calls with token
2. **curdsHook:** React Query `useQuery`/`useMutation` with toast notifications + cache invalidation
3. **Actions:** Named entity-specific wrappers (e.g. `useAddPurchaseItems`)
