

# ✈️ **Travelynk — Travel Buddy & Meetup Platform**

**Travelynk** is a subscription-based social travel platform designed to help travelers connect with compatible companions, share travel plans, and organize meaningful meetups. The system blends social networking with travel planning to transform solo trips into shared experiences—securely, scalably, and efficiently.

---

## 🌍 Project Overview

Travelynk enables users to:

- Discover travelers heading to similar destinations
- Match based on interests, dates, and travel styles
- Share detailed itineraries and travel profiles
- Build trust through post-trip reviews and ratings
- Unlock premium features via subscription plans

The platform is architected with **role-based access control**, **secure authentication**, and **scalable backend services**, making it suitable for real-world production deployment.

---

## 🎯 Objectives

- Build a modern social-travel web platform
- Enable trip sharing and intelligent traveler matching
- Support rich user profiles and itinerary management
- Ensure secure authentication and data persistence
- Provide a premium monetization model via subscriptions
- Deliver a clean, responsive, and engaging UI/UX

---

## 🚀 Core Features

### 1️⃣ User Authentication & Authorization

- Email & Password authentication
- JWT-based secure authentication
- Role-based access control:

  - **User**: Create travel plans, match with travelers
  - **Admin**: Manage users, travel plans, and platform content

- Secure password hashing using `bcrypt`

---

### 2️⃣ User Profile Management (CRUD)

- Full name and profile image (Cloudinary / ImgBB)
- Bio / About section
- Travel interests (e.g., hiking, food tours, photography)
- Visited countries
- Current location
- Public profile visibility for discovery

---

### 3️⃣ Travel Plan Management (CRUD)

- Destination (country / city)
- Travel date range
- Budget range
- Travel type (Solo, Family, Friends)
- Short itinerary or description
- Public visibility for matchmaking and discovery

---

### 4️⃣ Search & Matching System

- Search travelers and plans by:

  - Destination
  - Date range
  - Shared interests

- Enables efficient travel buddy discovery

---

### 5️⃣ Review & Rating System

- Post-trip mutual reviews
- 1–5 star rating system
- Editable and removable reviews
- Average rating and recent reviews displayed on profiles
- Trust-driven community building

---

### 6️⃣ Payment & Subscription System

- Premium subscription plans:

  - Monthly
  - Yearly

- Verified badge unlocked after subscription
- Payment gateway integrations:

  - Stripe

- Webhook-based payment verification

---

## 🧠 System Architecture

- **Backend**: RESTful API with layered architecture
- **Authentication**: JWT + session support
- **Database**: Prisma ORM with relational modeling
- **Caching (Optional)**: Redis-ready for scaling
- **Payments**: Secure webhook-driven payment flows

---

## 🛠️ Tech Stack

### Backend

- **Node.js**
- **Express.js (v5)**
- **TypeScript**
- **Prisma ORM**
- **JWT Authentication**
- **Zod** (Schema validation)
- **Stripe** (Payments)
- **Cloudinary** (Media uploads)
- **Redis** (Optional caching)
- **Nodemailer** (Email & OTP)

### Tooling

- **pnpm**
- **ESLint**
- **ts-node-dev**
- **Prisma Studio**

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/travelynk-server.git
cd travelynk-server
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Environment Configuration

Create a `.env` file and configure:

```env
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
```

---

### 4️⃣ Database Setup

```bash
pnpm db:generate
pnpm db:migrate
```

---

### 5️⃣ Run the Application

```bash
pnpm dev
```

---

## 🧪 Test Credentials

### Admin Account

```
Email: admin@example.com
Password: 123456
Role: Admin
```

### OTP (Testing Only)

```
OTP: 123456
```

---

## 🌐 Deployment

- **Live API Base URL**
  👉 [https://travelynk.onrender.com](https://travelynk.onrender.com)

- **Stripe Webhook Listener**

```bash
pnpm stripe:webhook
```

---

## 📜 Available Scripts

```bash
pnpm dev          # Run development server
pnpm build        # Compile TypeScript
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:migrate   # Run Prisma migrations
pnpm db:generate  # Generate Prisma client
pnpm db:studio    # Open Prisma Studio
```

---

## 🔐 Security Considerations

- Hashed passwords using `bcrypt`
- JWT-based authorization
- Role-based access enforcement
- Secure payment verification via webhooks
- Input validation using Zod schemas

---

## 📈 Scalability & Future Enhancements

- Advanced matchmaking algorithms
- Real-time chat between matched travelers
- Push notifications
- AI-powered travel recommendations
- Admin analytics dashboard
- Horizontal scaling with Redis + queue workers

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Travelynk**
A scalable, enterprise-ready social travel platform engineered for real-world deployment.

---
