# 🍫 3XCoCo | Luxury Handcrafted Chocolates



**3XCoCo** is a full-stack, production-ready e-commerce platform built with **Next.js 15** and **TypeScript**. It features a unified server-client architecture, real-time payment processing, and a comprehensive admin dashboard for inventory and order management.

**Deployment link:** https://3x-co-co-website.vercel.app/

---

## 🚀 Features

### 🛒 Customer Experience
- **🛍️ Storefront:** Responsive, luxury aesthetic design using Tailwind CSS.
- **🔍 Advanced Search:** Live search with debounced typeahead and filtering.
- **🛒 Smart Cart:** Persistent shopping cart powered by **Zustand** with quantity controls and "Buy Now" vs "Add to Cart" logic.
- **📍 Auto-Location:** One-click address filling using Browser Geolocation & OpenStreetMap API.
- **💳 Secure Checkout:** Integrated **Razorpay** payment gateway with coupon code system (`CHOCO10` for 10% off).
- **📦 Order Tracking:** Real-time order status tracking (Pending → Shipped → Delivered) via the "My Orders" dashboard.
- **🔔 Push Notifications:** Web Push Notifications for order updates (Shipped/Delivered).

### 🛡️ Admin Dashboard
- **📊 Overview:** Track total sales and order volume.
- **📦 Order Management:** Visual order cards with "Ship" and "Deliver" actions.
- **🍫 Inventory Management:** Add, Edit, and Delete products with drag-and-drop image uploads via **Cloudinary**.
- **🔔 Admin Alerts:** Receive push notifications immediately when a new order is placed.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB (Mongoose ODM)
- **State Management:** Zustand
- **Authentication:** JSON Web Tokens (JWT) with HttpOnly Cookies
- **Payments:** Razorpay Gateway
- **Media Storage:** Cloudinary
- **Notifications:** Web Push Protocol (VAPID)

---

## 🏗️ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```
git clone [https://github.com/your-username/3xcoco.git](https://github.com/your-username/3xcoco.git)
cd 3xcoco
```

### 2. Install Dependencies
```
npm install
```

### 3. Configure Environment Variables
Create a **.env.local** file in the root directory and populate it with your keys:
```
# --- Database ---
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/3xcoco

# --- Authentication ---
JWT_SECRET=your_super_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# --- Payments (Razorpay) ---
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx

# --- Image Uploads (Cloudinary) ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# --- Push Notifications (VAPID) ---
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:admin@3xcoco.com

# --- Email (Gmail App Password) ---
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_app_password
```
### Run the Server
```
npm run dev
```
## 🧪 How to Test
- **Register a User:** Sign up for a new account.

- **Make Admin:** Manually update the user's role to admin in MongoDB.

- **Shop:** Add items to cart as a user and checkout using Razorpay (Test Mode).

- **Manage:** Log in as Admin to view the order and mark it as "Shipped".

- **Notifications:** Ensure you clicked the "Get Updates" bell icon to receive alerts.


