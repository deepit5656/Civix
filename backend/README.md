# Civix Backend - Complete Setup Guide & API Documentation

## 🚀 Quick Start

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in your values (see Configuration section below).

### 4. Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**  
API Docs (Swagger): **http://localhost:5000/api-docs**

---

## ⚙️ Configuration (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT (use a long random string) |
| `PORT` | ❌ | Server port (default: 5000) |
| `CLOUDINARY_CLOUD_NAME` | For image upload | From cloudinary.com |
| `CLOUDINARY_API_KEY` | For image upload | From cloudinary.com |
| `CLOUDINARY_API_SECRET` | For image upload | From cloudinary.com |
| `EMAIL_ADMIN` | For emails | Gmail address |
| `ADMIN_PASS` | For emails | Gmail App Password |
| `DOMAIN_NAME` | ❌ | Email suffix for auto-admin role (e.g. @admin.civix.com) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS (default: http://localhost:3000) |

### MongoDB Setup Options

**Option A: Local MongoDB**
```
MONGO_URI=mongodb://localhost:27017/civix
```
Install MongoDB: https://www.mongodb.com/try/download/community

**Option B: MongoDB Atlas (Free Cloud)**
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/civix
```

### Cloudinary Setup (for image uploads)
1. Sign up free at https://cloudinary.com
2. Go to Dashboard → copy Cloud Name, API Key, API Secret

### Gmail App Password (for email notifications)
1. Enable 2-Factor Authentication on your Google account
2. Go to: Google Account → Security → App Passwords
3. Create app password for "Mail"
4. Use that 16-character password as `ADMIN_PASS`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout (clears cookie) |
| GET | `/api/auth/me` | JWT | Get current user |
| PUT | `/api/auth/change-password` | JWT | Change password |

### Issues
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/issues` | No | Get all issues (paginated) |
| GET | `/api/issues/stats` | No | Get issue statistics |
| GET | `/api/issues/user/my` | JWT | Get my submitted issues |
| GET | `/api/issues/:id` | No | Get single issue |
| POST | `/api/issues` | Optional | Create issue (with file upload) |
| PATCH | `/api/issues/:id` | JWT | Update own issue |
| PATCH | `/api/issues/:id/status` | Admin | Update issue status |
| DELETE | `/api/issues/:id` | Admin | Delete issue |

**Query params for GET /api/issues:**
- `status=Pending|In Progress|Resolved|Rejected`
- `category=Infrastructure|Water|Electricity|...`
- `page=1&limit=20`
- `search=keyword`

### Profile / Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | Admin | Get all users |
| GET | `/api/profile/me` | JWT | Get my profile |
| PUT | `/api/profile/me` | JWT | Update my profile |
| POST | `/api/profile/me/profile-picture` | JWT | Upload profile picture |
| GET | `/api/profile/:id` | JWT | Get user by ID |
| DELETE | `/api/profile/:id` | Admin | Delete user |
| PATCH | `/api/profile/:id/role` | Admin | Change user role |
| POST | `/api/profile/create-or-update` | No | Clerk integration |
| GET | `/api/profile/clerk/:clerkUserId` | No | Get by Clerk ID |
| PUT | `/api/profile/clerk/:clerkUserId` | No | Update by Clerk ID |
| POST | `/api/profile/clerk/:id/profile-picture` | No | Upload pic (Clerk) |

### Polls (Community Voting)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/polls` | No | Get all polls |
| GET | `/api/polls/:id` | No | Get single poll |
| POST | `/api/polls` | JWT | Create poll |
| POST | `/api/polls/:id/vote` | JWT | Vote on poll |
| PATCH | `/api/polls/:id/close` | Admin | Close poll |
| DELETE | `/api/polls/:id` | Admin | Delete poll |

### Feedback
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/feedback` | No | Submit feedback |
| GET | `/api/feedback` | Admin | Get all feedback |
| PATCH | `/api/feedback/:id/status` | Admin | Update feedback status |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/contributors` | Get contributors |
| GET | `/api-docs` | Swagger API documentation |

---

## 📁 Project Structure

```
backend/
├── server.js              # Main entry point
├── .env.example           # Environment variables template
├── package.json
├── config/
│   ├── mongo.js           # MongoDB connection
│   └── swagger.js         # Swagger/OpenAPI config
├── models/
│   ├── userModel.js       # User schema
│   ├── issues.js          # Issue schema
│   ├── poll.js            # Poll/Voting schema
│   ├── feedback.js        # Feedback schema
│   └── notification.js    # Notification schema
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── issues.js          # Issues logic
│   ├── profileControllers.js # User/profile logic
│   ├── pollController.js  # Voting logic
│   ├── feedbackController.js # Feedback logic
│   └── contributor.js     # Contributors
├── routes/
│   ├── auth.js
│   ├── issues.js
│   ├── profileRoutes.js
│   ├── pollRoutes.js
│   ├── feedbackRoutes.js
│   └── contributions.js
├── middlewares/
│   ├── validate.js        # JWT auth + input validation
│   ├── multer.middleware.js # File upload handling
│   ├── upload.js          # Upload alias
│   ├── errorHandler.js    # Global error handler
│   ├── xssSanitizer.js    # XSS protection
│   └── csrfProtection.js  # CSRF handling
├── utils/
│   ├── asyncHandler.js    # Async wrapper
│   ├── token.js           # JWT helpers
│   ├── sendEmail.js       # Nodemailer email
│   └── cloudinary.js      # Cloudinary upload
├── uploads/               # Local temp uploads (auto-created)
└── cache/
    └── contributors.json  # Contributors cache
```

---

## 🔒 Authentication

The API uses **JWT Bearer tokens**. Include the token in requests:

```
Authorization: Bearer <your_token>
```

Tokens are returned on login/signup and should be stored in localStorage or as httpOnly cookies.

---

## 📤 File Upload

Files are uploaded to **Cloudinary** (images, PDFs, audio, video up to 10MB).

---

## 🛡️ Security Features

- **Helmet.js** — HTTP security headers
- **CORS** — Whitelist-based origin control
- **Rate limiting** — 200 req/15min general, 20 req/15min for auth
- **XSS sanitization** — All input cleaned
- **bcrypt** — Passwords hashed with cost factor 12
- **JWT** — 30-day tokens with HS256
- **Input validation** — express-validator + Zod

---

## 🐛 Common Issues

**MongoDB connection fails:**
- Check `MONGO_URI` is correct
- For Atlas: whitelist your IP in Network Access

**Images not uploading:**
- Verify all 3 Cloudinary env vars are set
- Check Cloudinary dashboard for errors

**Emails not sending:**
- Use Gmail App Password, not regular password
- Enable 2FA first on Google account

**CORS errors from frontend:**
- Add your frontend URL to `FRONTEND_URL` in `.env`
- Or add to the allowedOrigins array in server.js
