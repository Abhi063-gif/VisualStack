# VisualStack Studio — Master Node Reference & Practical Use Case Manual

This manual provides an in-depth reference for all **127+ nodes** available in the **VisualStack Studio Blueprint Logic Engine**. Each node entry documents its purpose, input/output ports, parameters, and a step-by-step practical implementation example.

---

## 📌 Master Table of Contents

1. [Events & Entry Points](#1-events--entry-points)
2. [Logic, Conditions & Control Flow](#2-logic-conditions--control-flow)
3. [Authentication & User Security](#3-authentication--user-security)
4. [Database & Persistence](#4-database--persistence)
5. [API & External Web Services](#5-api--external-web-services)
6. [E-Commerce & Payment Gateway](#6-e-commerce--payment-gateway)
7. [Communication & Notifications](#7-communication--notifications)
8. [File Storage & Cloud Media](#8-file-storage--cloud-media)
9. [AI & Machine Learning](#9-ai--machine-learning)
10. [Navigation & Screen Routing](#10-navigation--screen-routing)
11. [Variables & State Management](#11-variables--state-management)
12. [Math, String & Date Operations](#12-math-string--date-operations)

---

## 1. Events & Entry Points

Event nodes are colored entry points that trigger visual logic execution when a user or system action occurs.

---

### ⚡ `App Started` (`event_app_started`)
- **Category**: `Events` | **Color**: Amber `#f59e0b`
- **Purpose**: Fires automatically once when the application finishes initializing in the browser or mobile runtime.
- **Inputs**: None (Root Trigger)
- **Outputs**:
  - `Then` (Execution) — Triggers initialization logic.
- **Real-World Example**: Check if a valid auth token exists in `localStorage` on application boot. If valid, fetch current user profile; otherwise, redirect to `/login`.

---

### 📄 `Page Loaded` (`event_page_loaded`)
- **Category**: `Events` | **Color**: Indigo `#6366f1`
- **Purpose**: Triggers whenever a specific page or screen finishes rendering.
- **Inputs**: None
- **Outputs**:
  - `Then` (Execution) — Executes page load queries.
- **Real-World Example**: Automatically fetch the latest 20 items from the database when opening the `/inventory` screen.

---

### 👆 `Button Clicked` (`event_button_click`)
- **Category**: `Events` | **Color**: Blue `#3b82f6`
- **Purpose**: Triggers when a specified button component is clicked by the user.
- **Outputs**:
  - `Then` (Execution) — Starts the click handler flow.
  - `Target` (`string`) — Returns the element ID of the clicked button.
- **Real-World Example**: Attach to `#submit-btn` to trigger form validation and login authentication.

---

### ✏️ `Input Changed` (`event_input_changed`)
- **Category**: `Events` | **Color**: Emerald `#10b981`
- **Purpose**: Fires live as the user types or modifies an input field.
- **Outputs**:
  - `Then` (Execution) — Triggers live filtering/search.
  - `Value` (`string`) — Current text value typed by user.
- **Real-World Example**: Pass typed text into a `Filter Array` or live search query node to update a product list dynamically.

---

### 📝 `Form Submitted` (`event_form_submitted`)
- **Category**: `Events` | **Color**: Purple `#8b5cf6`
- **Purpose**: Fires when a user submits an HTML/UI form container.
- **Outputs**:
  - `Then` (Execution) — Starts form processing.
  - `Form Data` (`object`) — Key-value pair object containing all form field entries (e.g. `{ email, password }`).
- **Real-World Example**: Connect `Form Data` directly into `User Signup` or `User Login` nodes.

---

### ⏰ `Timer` (`event_timer`)
- **Category**: `Events` | **Color**: Purple `#a855f7`
- **Purpose**: Fires repeatedly (interval) or once (timeout) after a specified delay (ms).
- **Config**: `delay: 5000` (ms), `repeat: true`
- **Outputs**:
  - `Then` (Execution) — Triggers periodic background refresh.
  - `Elapsed` (`number`) — Elapsed time in milliseconds.
- **Real-World Example**: Poll the server every 10 seconds to fetch unread notification badges.

---

## 2. Logic, Conditions & Control Flow

Control flow nodes allow your visual program to branch, loop, delay, and handle errors dynamically.

---

### 🔀 `Condition (If / Else)` (`cond_if`)
- **Category**: `Logic` | **Color**: Cyan `#06b6d4`
- **Purpose**: Evaluates a boolean input condition and splits workflow execution into `True` or `False` branches.
- **Inputs**:
  - `Execute` (Execution) — Flow trigger.
  - `Condition` (`boolean`) — Expression to evaluate.
- **Outputs**:
  - `True` (Execution) — Executed if condition is true.
  - `False` (Execution) — Executed if condition is false.
- **Real-World Example**: Connect `User.role === 'admin'`. If `True`, navigate to `/admin`; if `False`, show `Show Error` ("Access Denied").

---

### 🔴 `Show Error` (`action_show_error`) — Universal Error Alert
- **Category**: `Logic` | **Color**: Red `#ef4444`
- **Purpose**: Universal Error Node — displays an interactive error alert, modal, or toast when an exception or error condition occurs.
- **Inputs**:
  - `Execute` (Execution) — Flow trigger.
  - `Error Type` (`string`, default: `'Login Error'`) — Categorizes the error.
  - `Error Message` (`string`, default: `'Account not found. Please check your credentials.'`) — User-facing error message.
  - `Error Code` (`string`, default: `'ERR_ACCOUNT_NOT_FOUND'`) — Machine code.
- **Outputs**:
  - `Then` (Execution) — Flow continuation after alert.
  - `On Error` (Execution) — Branch for error logging.
  - `Message Text` (`string`) — Output message string for logging or toast.
- **Real-World Example**: Connect `User Login` ➔ `Failed` branch to `Show Error` node configured with `"Account not found"`.

---

### 🔁 `Loop (For Each)` (`loop_for_each`)
- **Category**: `Logic` | **Color**: Violet `#8b5cf6`
- **Purpose**: Iterates over an array of items (e.g. cart items, user records) and executes child nodes for each item.
- **Inputs**:
  - `Execute` (Execution) — Trigger loop start.
  - `Array` (`array`) — List of items to iterate over.
- **Outputs**:
  - `Loop Body` (Execution) — Executed once per item.
  - `Item` (`any`) — Current item in iteration.
  - `Index` (`number`) — Current index position (0, 1, 2...).
  - `Completed` (Execution) — Executed when loop finishes all items.
- **Real-World Example**: Loop over shopping cart items to compute total order cost and create individual order items.

---

### ⌛ `Delay / Sleep` (`delay_wait`)
- **Category**: `Logic` | **Color**: Slate `#64748b`
- **Purpose**: Suspends execution for a specified duration in milliseconds before proceeding to the next node.
- **Inputs**:
  - `Execute` (Execution)
  - `Duration` (`number`, default: `2000`) — Delay time in ms.
- **Outputs**:
  - `Then` (Execution) — Resumes workflow after delay.
- **Real-World Example**: Wait 3 seconds after showing a success toast before auto-redirecting to the home page.

---

## 3. Authentication & User Security

Authentication nodes handle sign-in, signup, password hashing, role checks, and security tokens.

---

### 🔑 `User Login` (`auth_login`)
- **Category**: `Auth` | **Color**: Blue `#3b82f6`
- **Purpose**: Authenticates user credentials (email & password) against database records or identity provider.
- **Inputs**:
  - `Execute` (Execution)
  - `Email` (`string`)
  - `Password` (`string`)
- **Outputs**:
  - `Success` (Execution) — Triggers on valid credentials.
  - `Failed` (Execution) — Triggers on invalid email/password or account not found.
  - `User Object` (`object`) — Authenticated user details `{ id, email, role }`.
  - `Auth Token` (`string`) — JWT access token.
- **Real-World Blueprint**:
```
[Form Submitted] ──> [User Login]
                      ├──(Success)──> [Go To Screen (/dashboard)]
                      └──(Failed)───> [Show Error ("Account Not Found")]
```

---

### 👤 `User Signup` (`auth_signup`)
- **Category**: `Auth` | **Color**: Blue `#3b82f6`
- **Purpose**: Creates a new user account with hashed password and initial metadata.
- **Inputs**:
  - `Execute` (Execution)
  - `Email` (`string`)
  - `Password` (`string`)
  - `Metadata` (`object`) — Extra profile data `{ fullName, phone }`.
- **Outputs**:
  - `Success` (Execution) — Account created successfully.
  - `Error` (Execution) — Account creation failed (e.g. Email already exists).
  - `User Object` (`object`)

---

### 🔒 `Hash Password` (`auth_hash_password`)
- **Category**: `Auth` | **Color**: Purple `#8b5cf6`
- **Purpose**: Hashes a plain-text password using industry-standard bcrypt or Argon2 algorithm before database storage.
- **Inputs**:
  - `Password` (`string`)
- **Outputs**:
  - `Hashed Password` (`string`) — Secure salted hash string `$2b$10$...`.

---

### 🛡️ `Check Role / Permission` (`auth_check_role`)
- **Category**: `Auth` | **Color**: Purple `#8b5cf6`
- **Purpose**: Verifies if the logged-in user possesses a required role (`Admin`, `Editor`, `Member`).
- **Inputs**:
  - `Execute` (Execution)
  - `Required Role` (`string`, e.g. `'admin'`)
- **Outputs**:
  - `Allowed` (Execution) — User has permission.
  - `Denied` (Execution) — User lacks role.

---

## 4. Database & Persistence

Database nodes execute CRUD operations against relational (PostgreSQL, MySQL, SQLite) or NoSQL (MongoDB, Supabase) databases.

---

### 🗄️ `Find Records` (`db_find_many`)
- **Category**: `Database` | **Color**: Cyan `#06b6d4`
- **Purpose**: Queries multiple rows matching filters, sort orders, and pagination limits.
- **Inputs**:
  - `Execute` (Execution)
  - `Table` (`string`) — Target database table name (e.g. `'users'`, `'products'`).
  - `Filter` (`object`) — Query criteria `{ role: 'customer', active: true }`.
  - `Sort By` (`object`) — `{ created_at: 'DESC' }`.
  - `Limit` (`number`) — Max records to return.
- **Outputs**:
  - `Success` (Execution)
  - `Error` (Execution)
  - `Records` (`array`) — Returned list of record objects.
  - `Count` (`number`) — Total count of matching records.

---

### ➕ `Insert Record` (`db_insert_one`)
- **Category**: `Database` | **Color**: Cyan `#06b6d4`
- **Purpose**: Creates a new row/document in the specified database table.
- **Inputs**:
  - `Execute` (Execution)
  - `Table` (`string`)
  - `Record Data` (`object`) — Data to insert.
- **Outputs**:
  - `Success` (Execution)
  - `Inserted Record` (`object`) — Returned row including generated ID.

---

### ✏️ `Update Record` (`db_update_one`)
- **Category**: `Database` | **Color**: Cyan `#06b6d4`
- **Purpose**: Modifies existing record fields matching primary key ID or criteria.
- **Inputs**:
  - `Execute` (Execution)
  - `Table` (`string`)
  - `Record ID` (`string`)
  - `Update Data` (`object`)
- **Outputs**:
  - `Success` (Execution)

---

## 5. API & External Web Services

---

### 🌐 `API Request / Fetch` (`api_fetch`)
- **Category**: `API` | **Color**: Orange `#f97316`
- **Purpose**: Sends custom HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) to external REST APIs.
- **Inputs**:
  - `Execute` (Execution)
  - `URL` (`string`) — API endpoint URL (`https://api.stripe.com/v1/charges`).
  - `Method` (`string`) — HTTP method (`GET`, `POST`, etc.).
  - `Headers` (`object`) — Header key-value pairs `{ Authorization: 'Bearer xxx' }`.
  - `Body` (`object` / `string`) — Request payload.
- **Outputs**:
  - `Success (2xx)` (Execution)
  - `Error (4xx/5xx)` (Execution)
  - `Response Data` (`object` / `string`)
  - `Status Code` (`number`)

---

## 6. E-Commerce & Payment Gateway

---

### 💳 `Create Stripe Checkout` (`ecommerce_stripe_checkout`)
- **Category**: `E-Commerce` | **Color**: Violet `#8b5cf6`
- **Purpose**: Creates a Stripe Payment Checkout Session and returns a secure payment URL.
- **Inputs**:
  - `Execute` (Execution)
  - `Line Items` (`array`) — Product items `[{ price: 'price_123', quantity: 1 }]`.
  - `Success URL` (`string`) — `/checkout-success`
  - `Cancel URL` (`string`) — `/cart`
- **Outputs**:
  - `Success` (Execution)
  - `Checkout URL` (`string`) — Stripe hosted checkout link.

---

## 7. Communication & Notifications

---

### 📧 `Send Email` (`comm_send_email`)
- **Category**: `Communication` | **Color**: Pink `#ec4899`
- **Purpose**: Sends transactional emails via Resend, SendGrid, or custom SMTP server.
- **Inputs**:
  - `Execute` (Execution)
  - `To Email` (`string`) — Recipient address.
  - `Subject` (`string`) — Email subject line.
  - `HTML / Text Body` (`string`) — Content body.
- **Outputs**:
  - `Sent` (Execution)
  - `Failed` (Execution)
  - `Message ID` (`string`)

---

## 8. Navigation & Screen Control

---

### 🚀 `Go To Screen` (`nav_go_to`)
- **Category**: `Navigation` | **Color**: Indigo `#6366f1`
- **Purpose**: Navigates the user to a specified target route/screen.
- **Inputs**:
  - `Execute` (Execution)
  - `Screen` (`string`) — Target route path (`/dashboard`, `/profile`).
  - `Params` (`object`) — Route parameter payload `{ userId: '123' }`.
- **Outputs**:
  - `Then` (Execution)

---

### 🪟 `Open Modal` (`nav_open_modal`)
- **Category**: `Navigation` | **Color**: Purple `#8b5cf6`
- **Purpose**: Pops open a specified modal dialog window on the canvas.
- **Inputs**:
  - `Execute` (Execution)
  - `Modal ID` (`string`) — Target modal identifier.
- **Outputs**:
  - `Then` (Execution)

---

## 9. Variables & State Management

---

### 📦 `Set Variable` (`var_set`)
- **Category**: `Variables` | **Color**: Emerald `#10b981`
- **Purpose**: Stores a value in local, global, or session variable state.
- **Inputs**:
  - `Execute` (Execution)
  - `Variable Name` (`string`)
  - `Value` (`any`)
- **Outputs**:
  - `Then` (Execution)

---

### 🔍 `Get Variable` (`var_get`)
- **Category**: `Variables` | **Color**: Emerald `#10b981`
- **Purpose**: Retrieves the stored value of a variable by name.
- **Outputs**:
  - `Value` (`any`)

---

## 💡 Practical Complete Blueprint Workflow Example

### User Registration & Welcome Email Architecture

```
[Form Submitted]
       │
       ▼
[Hash Password] ──(Hashed Pass)──> [Insert Record (users table)]
                                              │
                         ┌────────────────────┴────────────────────┐
                         ▼                                         ▼
                     (Success)                                  (Error)
                         │                                         │
                         ▼                                         ▼
                 [Send Email]                             [Show Error Alert]
          ("Welcome to VisualStack!")                   ("Registration Failed")
                         │
                         ▼
             [Go To Screen (/dashboard)]
```

---
*VisualStack Studio Manual — Updated Version 2.0*
