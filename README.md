# ProjectJS

A web application built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and other supporting tools.  
This project includes features such as product management, image upload to Cloudinary, user authentication with email/OTP, and rendering with Pug.

---

## 🚀 Tech Stack

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) – Backend framework  
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) + [Mongoose](https://mongoosejs.com/) – Database  
- [Cloudinary](https://cloudinary.com/) – Image storage & processing  
- [Multer](https://github.com/expressjs/multer) – File upload  
- [Nodemailer](https://nodemailer.com/) – Email service  
- [Pug](https://pugjs.org/) – Template engine  
- [Moment.js](https://momentjs.com/) – Date/time handling  

---

## 📦 Installation

Clone the project:

```bash
git clone git clone https://github.com/MinhThien2k5/SSR-Ecommerce-Website.git
cd projectjs

Install dependencies
npm install

Development
npm run dev

Production
npm start

Default app URL:
👉 http://localhost:3000

Project Structure
projectjs/
│── src/
│   ├── index.js        # Server entry point
│   ├── routes/         # Route definitions
│   ├── models/         # Mongoose models
│   ├── controllers/    # Business logic
│   ├── views/          # Pug templates
│   └── public/         # Static files (css, js, img)
│
│── .env                # Environment variables
│── package.json
│── README.md

NPM Scripts

npm run dev – Run with nodemon (hot reload)

npm start – Run in production

Troubleshooting

If you face MongoDB connection timeout on Vercel:

Go to MongoDB Atlas → Network Access → add IP 0.0.0.0/0

Check your MONGO_URL environment variable on Vercel


