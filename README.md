## 🍫 3XCoCo - Luxury Chocolate E-commerce
A full-stack, responsive e-commerce application built with Next.js 15 (App Router), MongoDB, and Razorpay for payment processing. This project features a unified architecture where the frontend and backend live in a single repository, offering a seamless shopping experience for customers and a robust dashboard for administrators.
## 🚀 Features

## 🛒 Customer Experience
##### Modern UI/UX: 
Responsive design with Tailwind CSS, featuring "Dark & Moody" luxury aesthetics.

##### Product Discovery: 
Browse collections, filter by category, and Live Search with typeahead suggestions.

##### Smart Cart: 
Zustand-powered cart with persistent storage, quantity controls (+/-), and coupon code support.

###### Checkout: 
Seamless integration with Razorpay for secure payments.

###### Auto-Address: 
One-click address filling using Browser Geolocation & OpenStreetMap API.

###### Order Tracking: 
"My Orders" section to track shipping status (Pending → Shipped → Delivered).

###### Secure Auth: 
JWT-based authentication with HttpOnly cookies for Login, Registration, and Forgot Password flows

##🛡️ Admin Dashboard
##### Product Management: 
Add, Edit, and Delete products via a visual interface.

##### Image Uploads: 
Drag-and-drop image uploads powered by Cloudinary.

##### Order Management: 
View all customer orders and update shipping statuses.

##### Analytics: 
Quick view of total sales and order counts.

## 🛠️ Tech Stack
##### Framework: 
Next.js 15 (App Router, Server Actions, API Routes)

##### Language: 
TypeScript

##### Database: 
MongoDB (via Mongoose)

##### Styling: 
Tailwind CSS, Lucide React (Icons)

##### State Management: 
Zustand

##### Payments: 
Razorpay

##### Media: 
Cloudinary (Uploads))

##### Auth: 
JSON Web Tokens (JWT), Bcrypt.js, Nodemailer

## 🏗️ Getting Started
Follow these steps to set up the project locally.

### Prerequisites
Node.js (v18+)

- MongoDB Atlas Account (or local MongoDB)

- Razorpay Account (Test Mode)

- Cloudinary Account

#### Clone the Repository
```
git clone https://github.com/your-username/3xcoco.git
cd 3xcoco
```
#### Install Dependencies
```
npm install
```
#### Configure Environment Variables
Create a file named .env.local in the root directory and add the following keys:
```
# --- Database ---
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/3xcoco

# --- Authentication ---
JWT_SECRET=your_super_secret_jwt_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# --- Payments (Razorpay) ---
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx

# --- Image Uploads (Cloudinary) ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# --- Email Services (Gmail App Password) ---
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_app_password
```
### Seed the Database
visit http://localhost:3000/api/seed in your browser if you haven't set up the script.

#### Run the Server
```
npm run dev
```
Open http://localhost:3000 to view the app.

## 💳 Testing Payments (Razorpay)
Since the app is in Test Mode:

Add items to the cart and proceed to checkout.

In the Razorpay popup, choose Netbanking.

Select any test bank (e.g., "Test Bank").

The payment will succeed, and you will be redirected to the Success page.

## 🛡️ Admin Access
To access the admin panel:

Register a new user account.

Manually update the user's role to "admin" in your MongoDB database (users collection).

Log out and log back in.

Navigate to /admin/dashboard.
