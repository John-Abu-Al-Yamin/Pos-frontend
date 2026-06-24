# Purchase Flow — POS System (Frontend)

Reference document for the purchase module implementation. Covers both the backend API contract and the frontend architecture built with React 19, React Query, shadcn/ui, and Tailwind CSS v4.

---

## 1. Technology Stack

| Layer              | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Framework          | React 19 (JSX)                                               |
| Build Tool         | Vite 7 (via rolldown)                                        |
| Routing            | react-router-dom v7                                          |
| Data Fetching      | @tanstack/react-query v5                                     |
| HTTP Client        | Axios                                                        |
| Forms              | react-hook-form v7 + @hookform/resolvers (Zod)               |
| Validation         | Zod v4                                                       |
| UI Library         | shadcn/ui (Radix primitives)                                 |
| CSS                | Tailwind CSS v4 + `tw-animate-css`                           |
| Icons              | lucide-react                                                 |
| Calendar           | react-day-picker v9                                          |
| Toasts             | sonner                                                       |
| i18n               | i18next + react-i18next + i18next-http-backend               |
| Cookies            | js-cookie (`POS_TOKEN`)                                      |

---

## 2. Core Entities & API Endpoints

All endpoints require `Authorization: Bearer <token>` (Sanctum).

| Entity           | Base Endpoint            | Purpose                              |
| ---------------- | ------------------------ | ------------------------------------ |
| Auth Login       | `/login`                 | Authenticate (email + password)      |
| Categories       | `/categories`            | Product groupings (Smartphones, etc) |
| Products         | `/products`              | Catalog items — what you sell        |
| Suppliers        | `/suppliers`             | Who you buy from                     |
| Purchase Headers | `/purchase-headers`      | A purchase transaction               |
| Purchase Items   | `/purchase-items`        | Line items within a purchase         |
| Stock Items      | `/stock-items`           | Individual units in inventory        |

Base URL: `http://127.0.0.1:8000/api`

All resources are standard CRUD: `index`, `store`, `show`, `update`, `destroy`.

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

### 3.4 Purchase Header

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

> **Note:** The frontend schema also includes `reference` (required text field) on purchase headers.

### 3.5 Purchase Item

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

### 3.6 Stock Item

```json
{
  "id": 1,
  "product_id": 1,
  "purchase_item_id": 1,
  "serial_number": "SN-0001-20260621-A7X2",
  "cost_price": 4500.00,
  "condition": "new",
  "status": "available",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

| Field           | Type   | Values                                           |
| --------------- | ------ | ------------------------------------------------ |
| `condition`     | string | `new`, `excellent`, `good`, `fair`               |
| `status`        | string | `available`, `sold`, `reserved`, `damaged`, `returned` |

---

## 4. Frontend Architecture

### 4.1 Authentication Flow

1. User submits email + password → `POST /login`
2. On success: JWT token stored in cookie `POS_TOKEN` (via `js-cookie`), user object in `localStorage`
3. `ProtectedRoute` checks `checkAuthToken()` → redirects to `/auth/login` if missing
4. `PublicRoute` redirects to `/` if token exists
5. Logout: removes cookie → redirects to `/auth/login`
6. All API requests auto-attach `Bearer <token>` via Axios interceptor (`clientService.js`)

### 4.2 Route Table

| Path | Component | Guard | Layout |
|---|---|---|---|
| `/auth/login` | `LoginForm` | `PublicRoute` | `AuthLayout` |
| `/` | `Dashboard` | `ProtectedRoute` | `MainLayout` |
| `/categories` | `CategoryPage` | `ProtectedRoute` | `MainLayout` |
| `/products` | `ProductPage` | `ProtectedRoute` | `MainLayout` |
| `/suppliers` | `SuppliersPage` | `ProtectedRoute` | `MainLayout` |
| `/purchases` | `PurchasesPage` | `ProtectedRoute` | `MainLayout` |
| `/purchases/add` | `PurchasesAdd` | `ProtectedRoute` | `MainLayout` |
| `/purchases/edit/:id` | `PurchasesEdit` | `ProtectedRoute` | `MainLayout` |
| `/purchases/:id` | `PurchasesDetails` | `ProtectedRoute` | `MainLayout` |
| `/purchases/:purchaseId/items/:itemId` | `PurchaseItemDetails` | `ProtectedRoute` | `MainLayout` |
| `/purchases/:purchaseId/items/:itemId/edit` | `PurchaseItemEdit` | `ProtectedRoute` | `MainLayout` |
| `*` | `ErrorPage` (404) | `ProtectedRoute` | `MainLayout` |

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

### 4.4 API Endpoint Constants

Defined in `hooks/EndPoints/endPoints.js`:

```js
const endPoints = {
  login: "/login",
  categories: "/categories",
  products: "/products",
  suppliers: "/suppliers",
  purchaseHeaders: "/purchase-headers",
  purchaseItems: "/purchase-items",
};
```

### 4.5 Form & Validation Patterns

All forms use **react-hook-form** with **Zod** schemas via `@hookform/resolvers/zod`.

| Schema | File | Fields | Key Rules |
|---|---|---|---|
| `categorySchema` | `validation/category/category.js` | `name` | min 2 chars, letters only (Arabic/English), no digits |
| `productsSchema` | `validation/products/products.js` | `name`, `category_id`, `is_serialized` | name 1-100 chars, category required, `is_serialized` boolean |
| `suppliersSchema` | `validation/suppliers/suppliers.js` | `name`, `phone` | name min 2, no digits; phone: Egyptian mobile regex `^01[0-2,5]{1}[0-9]{8}$` |
| `purchasesSchema` | `validation/Purchases/Purchases.js` | `supplier_id`, `date`, `reference`, `type` | `supplier_id` required when `type="purchase"`; date required; reference required; type enum |

**Inline validation** (used in `AddItemModal`, `PurchaseItemEdit`):
- `quantity`: required, min 1
- `unit_cost`: required, min 0
- `condition`: required only for serialized products

### 4.6 Reusable Components

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
| `LanguageSwitcher` | `MainLayout` | i18n language toggle (commented out in sidebar) |

### 4.7 State Management

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

### 6.1 Purchases List (`/purchases`)
- **Component:** `PurchasesPage`
- Table with columns: ID, supplier name, supplier phone, reference, reference_code, date, total, type badge, created_at, actions dropdown
- Actions: View Details, Edit, Deactivate (unwired)
- "Add Purchase" button → `/purchases/add`
- Pagination state ready but no UI controls rendered yet

### 6.2 Add Purchase (`/purchases/add`)
- **Component:** `PurchasesAdd`
- Form fields: `supplier_id` (Select), `date` (Calendar Popover), `reference` (text), `type` (card toggle)
- Zod schema: `purchasesSchema`
- On success: navigates to `/purchases`
- Type toggle: two clickable cards — "Purchase" (red) / "Opening Stock" (green)
- Date formatted to `YYYY-MM-DD` before submit

### 6.3 Edit Purchase (`/purchases/edit/:id`)
- **Component:** `PurchasesEdit`
- Pre-populated via `useGetPurchaseHeadersById(id)`
- Same form layout as `PurchasesAdd`
- Uses `initialized` state flag to delay render until `reset()` is called
- Submits via `useUpdatePurchaseHeaders(id)`

### 6.4 Purchase Details (`/purchases/:id`)
- **Component:** `PurchasesDetails`
- Top: `InvoiceInfoCards` — supplier, date, reference, type badge
- Bottom: `InvoiceItemsSection` — item table with product, condition, qty, cost, total, actions
- "Add Item" button → opens `AddItemModal` dialog
- Live `grandTotal` calculation from line totals
- Item actions: View (`/purchases/:purchaseId/items/:itemId`), Edit (`/.../edit`), Delete (AlertDialog confirm)

### 6.5 Purchase Item Details (`/purchases/:purchaseId/items/:itemId`)
- **Component:** `PurchaseItemDetails`
- Two `InfoCard` sections: Item Information + Invoice Information
- Shows product name, item ID, condition, serialized status, unit cost, quantity, line total, header reference, date, type

### 6.6 Edit Purchase Item (`/purchases/:purchaseId/items/:itemId/edit`)
- **Component:** `PurchaseItemEdit`
- Read-only product display with serialized/non-serialized badge
- Editable: `quantity`, `unit_cost`, `condition` (only if serialized)
- Live expected total preview (qty × unit_cost)
- Submits via `useUpdatePurchaseItem(itemId)`

### 6.7 Categories (`/categories`)
- **Component:** `CategoryPage`
- Card grid layout (2 cols desktop, 4 cols wide)
- CRUD via modals (AppModalAdd / AppModalEdite)
- Delete via toast confirmation

### 6.8 Products (`/products`)
- **Component:** `ProductPage`
- Card grid layout
- Fields: name, category_id (Select), is_serialized (toggle: "موبايل" / "اكسسوار")
- CRUD via modals

### 6.9 Suppliers (`/suppliers`)
- **Component:** `SuppliersPage`
- Card grid layout
- Fields: name, phone (Egyptian mobile validation)
- CRUD via modals

---

## 7. Purchase Item Notes

- `line_total` is **not sent** from the client — it is calculated on the backend.
- **Updating** a purchase item does **not** retroactively modify already-created stock items.
- **Deleting** a purchase item cascades to its stock items (they are deleted as well, per FK `cascadeOnDelete` on `purchase_item_id`).
- When adding an item via `AddItemModal`, `condition` field only shows if the selected product is serialized.
- Non-serialized products automatically display "جديد" (New) in `PurchaseItemEdit`, with the condition field hidden.

---

## 8. Validation Reference

### 8.1 Backend (Laravel)

| Field               | Rules                                                   |
| ------------------- | ------------------------------------------------------- |
| `name` (category)   | `required|string|unique:categories,name`                |
| `name` (product)    | `required|string`                                       |
| `category_id`       | `required|exists:categories,id`                         |
| `is_serialized`     | `boolean`                                               |
| `phone` (supplier)  | `required|unique:suppliers,phone`                       |
| `supplier_id`       | `nullable|exists:suppliers,id`                          |
| `date`              | `required|date`                                         |
| `type`              | `required|in:purchase,opening_stock`                    |
| `quantity`          | `required|integer|min:1`                                |
| `unit_cost`         | `required|numeric|min:0`                                |
| `condition`         | `nullable|in:new,excellent,good,fair`                   |
| `status`            | `nullable|in:available,sold,reserved,damaged,returned`  |
| `serial_number`     | `nullable|string|unique:stock_items,serial_number`      |
| `cost_price`        | `required|numeric|min:0`                                |

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

---

## 9. Known Issues & Leftovers

- **Stock Items page:** Backend has `/api/stock-items` but no frontend page exists for browsing stock items.
- **Dashboard data:** `QuickActions` and `StatsCards` contain real-estate themed placeholder content (leftover from a different project).
- **PatchRequest bug:** `hooks/handleRequest/PatchRequest.js` uses `method: "POST"` instead of `"PATCH"`.
- **usePatchData bug:** Imports `useAuthContext` from `@/context/AuthContext` which does not exist.
- **useCurdsUsers bug:** References non-existent `@/config/endPoints` and `@/config/queryKes`.
- **Users page:** Not implemented (no route, broken hooks).
- **AppDeleteModal:** Stub component — returns `<div>AppDeleteModal</div>` only, never used.
- **i18n inconsistency:** Desktop sidebar uses hardcoded Arabic; mobile sidebar uses `t("sidebar.*")` translation keys.
- **Pagination:** Purchase list has state for `page`/`limit` but no pagination controls rendered.
- **Deactivate action:** Dropdown item exists in purchase list with no logic wired up.

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
│   └── utils.js                      # cn(), formatDate()
│
├── services/
│   ├── clientService.js              # Axios instance + Bearer token
│   ├── cookies.js                    # js-cookie: POS_TOKEN
│   └── jwt.js                        # JWT decode helper
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
│   ├── dashboard/Header.jsx, QuickActions.jsx, StatsCards.jsx
│   └── purchases/
│       ├── InvoiceInfoCards.jsx
│       ├── InvoiceItemsSection.jsx
│       └── AddItemModal.jsx
│
├── customs/
│   ├── CustomHeader.jsx
│   ├── CustomTable.jsx
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
│   ├── skeleton.jsx, table.jsx
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
│   │   ├── PurchaseHeaders/useCurdsPurchaseHeaders.jsx
│   │   ├── PurchaseItems/useCurdsPurchaseItems.jsx
│   │   └── users/useCurdsUsers.jsx   (broken)
│   └── useSearch/useSearch.jsx
│
└── validation/
    ├── category/category.js
    ├── products/products.js
    ├── suppliers/suppliers.js
    └── Purchases/Purchases.js
```

---

## 11. Internationalization

- **Library:** i18next + react-i18next
- **Backend:** i18next-http-backend (loads `public/locales/{lang}/translation.json`)
- **Detection:** i18next-browser-languagedetector
- **Fallback:** English (`en`)
- **Feature:** `LanguageSwitcher` component toggles between `en` / `ar`; RTL-aware layouts
- **Translation files:**
  - `public/locales/en/translation.json`
  - `public/locales/ar/translation.json`

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
