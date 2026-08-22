<div align="center">

# ⚡️ API Gateway  
### A lightweight, secure, and scalable **Node.js API Gateway** built with Express

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Deploy with Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br>

💡 **Official Repository:**  
👉 [ZIPP — GitHub Repository](https://github.com/PIYUSH-GIRI23/zipp)

</div>

---

## 🚀 Features

✅ **Authentication Middleware** — Secure API access using JWT or session-based auth  
🚦 **Rate Limiting** — Prevent abuse with a configurable request rate limiter  
🔐 **Signup & Account Gateway** — Direct proxying for `/auth/send-signup-otp`, `/auth/verify-signup-otp`, and user management  
🧩 **Modular Routes** — Organized routes for easy scalability (`auth`, `clip`, etc.)  
⚙️ **Environment Config** — Centralized `.env` management  
☁️ **Vercel Ready** — Seamless cloud deployment  
🧠 **Utility Layer** — Device info, validation helpers, and more  

---

## 🧱 Project Structure

<pre>
api_gateway/
├── controllers/                 # Controller endpoint handlers
│   ├── authController.js        # Auth controller
│   └── clipController.js        # Clip controller
│
├── db/                          # Database connection setup
│
├── node_modules/                # Installed dependencies
│
├── rate_limiter/                # Custom rate-limiting logic
│   └── ratelimit.js
│
├── routes/                      # API Route definitions
│   ├── authRoute.js             # Auth Express router
│   └── clipRoute.js             # Clip Express router
│
├── services/                    # Service layers to proxy microservices
│   ├── authService.js           # Auth proxy requests
│   └── clipService.js           # Clip proxy requests
│
├── utils/                       # Utility functions
│   ├── gatewayError.js          # Custom GatewayError class
│   └── deviceInfo.js            # Device information parser
│
├── .env                         # Environment variables
├── .env.config                  # Environment configuration template
├── .gitignore                   # Files ignored by Git
├── package.json                 # Project dependencies & metadata
├── package-lock.json            # Locked dependency versions
├── Readme.md                    # Project documentation ❤️
├── server.js                    # Entry point of the Gateway
└── vercel.json                  # Vercel deployment configuration
</pre>

---

## ⚙️ Setup & Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/PIYUSH-GIRI23/zipp-api_gateway.git

# 2️⃣ Move into the directory
cd api_gateway

# 3️⃣ Install dependencies
npm install

# 4️⃣ Set up environment variables
cp .env.config .env

# 5️⃣ Start the development server
npm run dev

---

<a href="mailto:giri.piyush2003@gmail.com"><img src="https://img.shields.io/badge/Mail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Mail"></a>
<a href="https://github.com/PIYUSH-GIRI23"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
<a href="https://www.linkedin.com/in/piyush-giri-031b71254/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
<a href="https://x.com/GIRIPIYUSH2310"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X"></a>