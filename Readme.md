# TaskPulse | MERN Task Management System

TaskPulse is a full-stack task management application built with the **MERN** stack (MongoDB, Express, React, Node.js). It features secure user authentication, real-time task CRUD operations, and a modern UI powered by Tailwind CSS.

## Key Features

* **Secure Authentication:** User registration and login using JWT (JSON Web Tokens) and Bcrypt password hashing.
* **Full CRUD:** Create, Read, and Delete tasks tied specifically to your user account.
* **Search Functionality:** Filter tasks in real-time using the dynamic search bar.
* **Responsive Design:** Fully mobile-responsive UI built with Tailwind CSS.
* **Protected Routes:** Backend API and Frontend pages are protected—only logged-in users can access data.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT, Bcrypt.js |

---

## Security Measures
Stateless Auth: We use JWT to ensure the server doesn't need to store session data.

Password Safety: Passwords are never stored in plain text. We use salt-based hashing with Bcrypt.

Input Sanitization: Express middleware handles JSON parsing and basic security checks.