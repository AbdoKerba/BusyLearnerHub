# ShopHub E-Commerce Platform

A modern, full-featured e-commerce platform built with React, Express, and TypeScript.

<div align="center">
  <img src="client/public/shop-hub-logo.svg" alt="ShopHub Logo" width="300">
</div>

## Features

- **User Authentication**: Secure login and registration system
- **Product Browsing**: Browse products by category, search, and filter options
- **Shopping Cart**: Add, update, and remove items from your cart
- **Checkout Process**: Secure payment processing with Stripe
- **Order Management**: View order history and details
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI components
- **Backend**: Express.js, Node.js
- **State Management**: React Query, Context API
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Payment Processing**: Stripe API
- **Authentication**: Passport.js
- **Database**: In-memory storage (can be extended to PostgreSQL)

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shop-hub.git
cd shop-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
SESSION_SECRET=your_session_secret_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

To get Stripe API keys:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your "Publishable key" (starts with `pk_`) for `VITE_STRIPE_PUBLIC_KEY`
3. Copy your "Secret key" (starts with `sk_`) for `STRIPE_SECRET_KEY`

### 4. Run the development server

```bash
npm run dev
```

This will start both the frontend and backend servers. The application will be available at:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

## Project Structure

```
shop-hub/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and client setup
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── public/             # Static assets
├── server/                 # Backend Express application
│   ├── auth.ts             # Authentication setup
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage implementation
│   └── vite.ts             # Vite configuration for backend
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema and types
└── package.json            # Project dependencies and scripts
```

## API Routes

- **Authentication**
  - `POST /api/register` - Register a new user
  - `POST /api/login` - Log in a user
  - `POST /api/logout` - Log out a user
  - `GET /api/user` - Get current user information

- **Products**
  - `GET /api/products` - Get all products (with optional filters)
  - `GET /api/products/:slug` - Get product by slug
  - `GET /api/products/new-arrivals` - Get new arrival products
  - `GET /api/products/featured` - Get featured products

- **Categories**
  - `GET /api/categories` - Get all categories

- **Orders**
  - `GET /api/orders` - Get user orders
  - `POST /api/orders` - Create a new order

- **Payments**
  - `POST /api/create-payment-intent` - Create a Stripe payment intent

## Deployment

### Building for production

To build the application for production, run:

```bash
npm run build
```

This will create optimized production builds for both the frontend and backend.

### Running in production

To run the application in production mode:

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/shop-hub](https://github.com/your-username/shop-hub)