# ERP System 💼

A complete **Employee Resource Planning (ERP)** system built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with **JWT-based authentication**. It supports role-based access (Admin, Manager, Employee) and enables companies to manage employee data, tasks, salaries, and attendance efficiently.

---

## 🚀 Tech Stack

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB, JWT, Bcrypt
- **Database**: MongoDB (Mongoose ODM)
- **Other Tools**: Postman, VS Code, Nodemon

---

## ✨ Features

- 🔐 Secure Login with JWT
- 👥 Role-based Access (Admin, Manager, Employee)
- 📋 Manage Employees, Tasks, and Attendance
- 💰 Salary Calculation and Management
- 🧾 Employee Joining Reports
- 📈 Dashboard Analytics
- 🔍 Search & Filter Functionality

---

## 🛠️ Installation

Make sure you have **Node.js**, **MongoDB**, and **npm** or **yarn** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/erp-system.git
cd erp-system
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the `backend` folder with:

```
MONGO_URI=mongodb://localhost:27017/erp
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The app will run at: [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
erp-system/
│
├── backend/         # Express backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── config/
│
├── frontend/        # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── utils/
│
├── screenshots/     # Project screenshots
└── README.md
```

---

## 🧪 API Testing

All backend APIs are tested using **Postman**. Authentication uses JWT tokens for protected routes.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo, open issues, or submit pull requests.

---

## 📬 Contact

**Pratap Majge**  
📧 [pratap.majge@example.com](mailto:pratap.majge@example.com)  
🌐 [LinkedIn](https://linkedin.com/in/pratapmajge)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
