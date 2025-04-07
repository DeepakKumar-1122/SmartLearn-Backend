# SmartLearn Backend

SmartLearn is a personalized learning platform that generates tailored learning paths using AI. This is the backend server built with **Node.js**, **Express**, and **MongoDB**, using the **Google Gemini API** for learning path generation.

---

## 🚀 Features

- User authentication (JWT-based)
- AI-powered course/learning path generation
- Course progress tracking (time spent, completion %)
- Topic reordering and customization
- Content-based course recommendations
- REST API for frontend communication

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Google Gemini API**
- **JWT Authentication**

---

## 📁 Folder Structure

```
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
└── server.js
```

---

## 🔐 Setup Environment Variables

To run the project, you need to set up a `.env` file in the root directory of the project.

1. Create a `.env` file.
2. Add the following variables with your credentials and API keys:

```
API_KEY=your_google_gemini_api_key_here
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## ▶️ Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/DeepakKumar-1122/SmartLearn-Backend.git
   cd SmartLearn-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create the `.env` file** as explained above.

4. **Start the server**
   ```bash
   node index.js
   ```

---

## 📫 API Endpoints

Base URL: `http://localhost:5000/api`

- `POST /auth/signup` – Register a new user
- `POST /auth/login` – User login
- `POST /courses/generate` – Generate a new course using Gemini API
- `PUT /courses/:courseId/timespent` – Update time spent on a course
- `PUT /courses/:courseId/complete` – Mark topic/resource as complete
- `GET /courses/recommendations` – Get course recommendations
- `DELETE /courses/:courseId` – Delete a course

---

## 🧠 Made with love for smarter learning.
