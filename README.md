# Exclusive Ecommerce - Frontend

This is the frontend application for the Exclusive Ecommerce platform, built with modern web technologies including React and Vite.

## 🚀 Features

- **User Authentication:** Login, register, and JWT-based session management.
- **Product Catalog:** Browse, search, and view detailed product information.
- **Shopping Cart & Wishlist:** Manage cart items, save favorites to a wishlist, and persist user choices.
- **Checkout Process:** Secure checkout flow with coupon application.
- **User Dashboard:** Order history, profile management, and order cancellation/returns.
- **Admin Panel:** Complete administrative dashboard to manage users, products, categories, coupons, and orders.
- **Real-time Notifications:** In-app notification system.
- **Responsive Design:** Fully responsive layout working beautifully on mobile, tablet, and desktop devices.

## 💻 Technologies Used

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/) (for the Admin Analytics Dashboard)
- **State Management:** React Context API

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A running instance of the backend API.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/basem-samir/ecommerce.git
   cd ecommerce/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `frontend` directory:
   ```env
   # The URL of your deployed backend or local server
   VITE_API_URL=http://localhost:5000
   ```
   *Note: If `VITE_API_URL` is omitted, the app will default to `http://localhost:5000`.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start, usually at `http://localhost:5173`.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs ESLint to catch formatting and code quality issues.

## 🌐 Deployment

When deploying to platforms like Vercel, Netlify, or Railway:
1. Set the Build Command to `npm run build`.
2. Set the Output Directory to `dist`.
3. Add your `VITE_API_URL` environment variable pointing to your live backend API in your hosting provider's dashboard.
