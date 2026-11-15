# Civix

Civix is a full-stack civic engagement platform for reporting local issues, tracking municipal responses, finding nearby services, and exploring public information.

## What is included

### Citizen services

- Report issues with descriptions, location, and optional evidence uploads.
- Track complaint status and request a review or escalation.
- Upvote community issues and participate in civic polls.
- Find nearby hospitals, police, fire, pharmacies, blood banks, shelters, and food banks.
- Submit Lost & Found notices and use the persistent community chat.
- Request blood donation, general help, or volunteering through Community Support.
- Manage profile, password reset, medical information, and emergency contacts.
- Use Civibot for service discovery, guided issue reporting, voice input, and spoken replies.
- Access SOS contacts and official public-service portals.

### Public information

Civix includes labelled datasets and service pages for transport, trains, elections, government schemes, budgets, disaster relief, schools, civic statistics, utilities, and vehicle services. Dataset pages identify the source or academic/timetable year where available; the data is not a substitute for the latest official notice.

### Administration

Admins can review issues, filter complaints, update statuses, view live analytics, manage users and polls, and export issue data as CSV, JSON, or browser-printable PDF.

## Technology

- **Frontend:** React, React Router, Tailwind utility classes, Lucide, Leaflet, Recharts
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **Authentication:** JWT, OTP verification, protected citizen/admin routes
- **Uploads and email:** Cloudinary and Nodemailer
- **AI:** Google Gemini with a local service-aware fallback
- **Testing:** Vitest, React Testing Library, Jest, Supertest, Cypress

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB locally or a MongoDB Atlas connection
- Optional: Cloudinary, email provider, and Gemini API credentials for their related features

## Local setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/deepit5656/Civix.git
cd Civix
npm install
cd backend
npm install
```

Create the backend environment file:

```bash
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead. Fill in the required values in `backend/.env`; never commit that file.

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend from the repository root in another terminal:

```bash
npm start
```

The frontend runs at `http://localhost:3000`. The API runs at `http://localhost:5000`. Health checks are available at `/health` and `/api/health`; Swagger is available at `/api-docs`.

## Environment variables

See [`backend/.env.example`](./backend/.env.example) for the complete template. At minimum, configure:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (defaults to `5000`)
- `FRONTEND_URL` (defaults to `http://localhost:3000`)

Cloudinary, email, and Gemini variables are needed only for image uploads, email notifications, and Gemini-assisted features.

## Testing

Run frontend tests from the repository root:

```bash
npm test -- --run
```

Run the production build:

```bash
npm run build
```

Run backend tests:

```bash
cd backend
npm test
```

Run Cypress when the frontend is available:

```bash
npm run cypress:open
```

The backend test setup can use MongoDB Memory Server. If a local MongoDB instance is unavailable, the application and some integration tests may report a connection warning; configure `MONGO_URI` or allow the test binary to be downloaded for a complete run.

## Project layout

```text
src/                 React application, pages, components, context, and API clients
public/              Static assets, dataset files, and service worker
backend/             Express API, MongoDB models, routes, controllers, and tests
.github/             Pull request and issue templates
```

## Mobile app

The mobile download page currently displays **Coming Soon** because Civix does not yet publish APK or App Store builds. The responsive web application remains available on mobile browsers.

## Contributing

1. Create a focused branch.
2. Make and test the change.
3. Keep secrets in local `.env` files.
4. Open a pull request using the repository template.
