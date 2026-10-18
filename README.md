# EventFlow - Full-Stack Event Booking & Management Platform

**Live Demo:** [Link](https://eventflowweb.netlify.app/)

EventFlow is a full-stack MERN application that allows users to discover events, submit booking requests, and verify their actions via two-factor email OTPs. It features a dedicated administrative dashboard for organizers to create and manage events, track live revenue metrics, and approve or reject ticket bookings.

---

## 🚀 Key Features

* **User Authentication & Authorization**: Secure signup and login powered by JSON Web Tokens (JWT) and bcrypt password hashing.
* **Two-Factor OTP Verification**:
  * **Account Activation**: Email-based OTP verification required upon registration or unverified login attempts.
  * **Secure Booking**: Mandatory OTP verification step to authorize each ticket reservation.
* **Role-Based Access Control (RBAC)**:
  * **Admin**: Create, edit, and delete events; inspect attendee details; approve booking requests with payment flags (`paid` / `non_paid`) or reject them. Access is strictly protected via role middleware.
  * **User**: Search and filter upcoming events, reserve tickets, inspect booking statuses in a personal dashboard, and cancel reservations.
* **Admin Analytics & Management**: Live dashboard tracking total revenue, distinct paid clients, and pending booking approvals.
* **Event Discovery & Instant Filtering**: Real-time multi-attribute search (title, category, location).
* **Responsive UI/UX**: Built with React, Tailwind CSS, React Icons, and React Hot Toast for instant feedback.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), React Router v6, Tailwind CSS, Axios, React Icons, React Hot Toast
* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT, bcryptjs
* **Email & Notifications**: Nodemailer / Resend SMTP

---

## ⚙️ Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster connection string)
* Gmail App Password

---

### 1. Environment Configuration

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkey_eventflow

# Email Configuration (Gmail SMTP)
USER_EMAIL=your_email@gmail.com
USER_PASS=your_16_character_google_app_password