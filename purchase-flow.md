# Purchase Flow — POS System (Frontend)

Reference document for implementing the purchase module. See the backend API for response shapes, validation rules, and service-layer behavior.

---

## 1. Core Entities & API Endpoints

All endpoints require `Authorization: Bearer <token>` (Sanctum).

| Entity           | Base Endpoint            | Purpose                              |
| ---------------- | ------------------------ | ------------------------------------ |
| Categories       | `/api/categories`        | Product groupings (Smartphones, etc) |
| Products         | `/api/products`          | Catalog items — what you sell        |
| Suppliers        | `/api/suppliers`         | Who you buy from                     |
| Purchase Headers | `/api/purchase-headers`  | A purchase transaction               |
| Purchase Items   | `/api/purchase-items`    | Line items within a purchase         |
| Stock Items      | `/api/stock-items`       | Individual units in inventory        |

All resources are standard CRUD: `index`, `store`, `show`, `update`, `destroy`.

---

## 2. Entity Details

### 2.1 Category

```json
{
  "id": 1,
  "name": "Smartphones",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

### 2.2 Product

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

### 2.3 Supplier

```json
{
  "id": 1,
  "name": "Samsung Distributor",
  "phone": "01000000000",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

### 2.4 Purchase Header

```json
{
  "id": 1,
  "supplier_id": 1,
  "date": "2026-06-20",
  "total": 135000.00,
  "type": "purchase",
  "created_at": "2026-06-21T...",
  "updated_at": "2026-06-21T..."
}
```

| Field   | Type   | Values                     |
| ------- | ------ | -------------------------- |
| `type`  | string | `purchase` or `opening_stock` |

### 2.5 Purchase Item

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

### 2.6 Stock Item

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

## 3. Purchase Flow Steps

### Standard Purchase

```
1. Define Category       → POST /api/categories
2. Define Product        → POST /api/products
3. Define Supplier       → POST /api/suppliers
4. Create Purchase Header → POST /api/purchase-headers
5. Add Purchase Items    → POST /api/purchase-items
6. Stock items generated → Automatic (server-side)
```

### Opening Stock

Same flow, but:
- `type: "opening_stock"` on the purchase header
- `supplier_id` omitted (nullable)

---

## 4. Typical UI Screens

| Screen                  | Key actions                                | Endpoints                     |
| ----------------------- | ------------------------------------------ | ----------------------------- |
| **Categories List**      | View, create, edit, delete categories     | `GET/POST/PUT/DELETE /api/categories` |
| **Products List**        | View, create, edit, delete products       | `GET/POST/PUT/DELETE /api/products` |
| **Suppliers List**       | View, create, edit, delete suppliers      | `GET/POST/PUT/DELETE /api/suppliers` |
| **New Purchase**         | Choose supplier, set date, type, add items | `POST /api/purchase-headers`, `POST /api/purchase-items` |
| **Purchase History**     | List all purchase headers with totals      | `GET /api/purchase-headers`   |
| **Purchase Detail**      | View items in a purchase                  | `GET /api/purchase-headers/{id}` (includes items) |
| **Stock Items List**     | Browse, search, edit, delete stock items  | `GET/POST/PUT/DELETE /api/stock-items` |

---

## 5. Purchase Item Notes

- `line_total` is **not sent** from the client — it is calculated on the backend.
- **Updating** a purchase item does **not** retroactively modify already-created stock items.
- **Deleting** a purchase item cascades to its stock items (they are deleted as well, per FK `cascadeOnDelete` on `purchase_item_id`? — verify backend behavior).

---

## 6. Validation Reference

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
