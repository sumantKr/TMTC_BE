# 🧳 Travel Itinerary Planner API (Node.js + Express)

This is the **backend API** for the Travel Itinerary Planner app, built using **Node.js**, **Express.js**, and **MongoDB**.

It provides RESTful endpoints for:

- User Authentication
- Itinerary Management
- Stats like total trips, upcoming trips, monthly budgets, and trip counts

---

## ⚙️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** Authentication with Cookies
- **TypeScript**
- **Zod** for validation
- **CORS** + **Helmet** for security
- **dotenv** for environment config

---

## 🚀 Getting Started

### 1. 📦 Install Dependencies

```bash
npm install

### 2. ⚙️ Environment Variables

API_VERSION,
PORT,
DB_PATH,
JWT_SECRET,
NODE_ENV,
CORS_ORIGIN,

### 3. ▶️ Start the Server

# Development (with nodemon)
npm run dev

# with docker
run docker compose up - the codebase is bind mounted and supports hmr
# Production
npm run build
npm start

🔐 Auth Flow
On login/register, a JWT is signed and sent as an HTTP-only cookie.

Frontend automatically uses the cookie on subsequent requests.

Middleware extracts and verifies the token to protect routes.
