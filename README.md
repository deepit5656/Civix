# 🚧 Civix – Local Civic Issue Reporting App  

**Domain**: Governance / Public Welfare  
**Tagline**: Empowering citizens, enabling better governance.  

![Issues](https://img.shields.io/github/issues/Harshs16/civix)
![Forks](https://img.shields.io/github/forks/Harshs16/civix)
![Stars](https://img.shields.io/github/stars/Harshs16/civix)

## 🧠 Overview
  
**Civix** is a full-stack web application designed to streamline the process of reporting, tracking, and resolving local civic issues such as potholes, broken streetlights, and uncollected garbage. It provides a bridge between citizens and municipal authorities, bringing accountability and transparency to local issue resolution. 

![Image](https://github.com/user-attachments/assets/a5c04052-c62e-4885-ad14-9084a63272f2)
*Caption: Citizen view showing issue reporting interface*

## 🚨 Problem Addressed  
Local civic issues often go unnoticed or unresolved due to:  
- Lack of structured, user-friendly reporting systems  
- No transparent status tracking  
- Difficulty in community prioritization  

## ✨ Features  

![Image](https://github.com/user-attachments/assets/b7f86a3e-3f51-4098-a5e7-eb14b134b111)
*Caption: Step-by-step issue reporting process*

### 🧍 Citizens  
- 📍 **Report Issues**: Submit problems with description, live location (via map), and image  
- 🔁 **Track Status**: View transitions from *Open → In Progress → Resolved*  
- 👍 **Upvote Issues**: Support others' reports to highlight common concerns  

### 🧑‍💼 Admins (City Workers)  
- 📊 **Dashboard**: View, filter, and manage all reported issues  
- 🔧 **Status Management**: Update progress and mark resolutions  
- 🔒 **Role-Based Access**: Secure login for Citizens and Admins  

### 📘 Civic Education & Rights  

Civix now includes a fully frontend civic learning module to educate users—especially students and first-time voters—about their rights and responsibilities.

**Route**: `/civic-education`  
**File**: `src/Pages/CivicEducation.jsx`

#### ✨ Highlights  
- 🧠 Interactive Quiz System with progress tracking and localStorage-based scores  
- 🏆 Gamified XP system, achievements, and level-ups  
- 🗂️ Tabbed layout for Overview, Learn, Quiz, and Resources  
- 🔖 Bookmark favorite sections and save them locally  
- 📊 Reading Progress Bar and Civic Journey visualization  
- 💡 Animated “Did You Know?” facts carousel  
- 📥 Downloadable PDFs and curated civic resources  
- 🎉 Celebration animations on milestone completions  

### 🧭 Civic Simulator

Civix now includes a standalone interactive simulator that allows users to step into civic leadership roles. Through animated dilemmas and slider-based decisions, users make trade-offs and explore the consequences of their choices—all within a frontend-only experience.

**Route**: `/civic-simulator`  
**File**: `src/Pages/CivicSimulator.jsx`

#### ✨ Highlights  
- 🎮 **Scenario Cards** – Solve dilemmas like budget allocation or policy conflicts using sliders and toggles  
- 🧠 **Outcome Feedback** – Dynamic responses based on user choices (public satisfaction, resource balance)  
- 📊 **Civic Style Profiling** – Discover civic personas like “Planner” or “Advocate” based on decisions  
- 🔁 **Replayable Challenges** – Rerun scenarios to improve your score and try alternate outcomes  
- 🏅 **XP & Badges** – Earn experience points and unlock achievement badges locally  
- 💡 **Frontend-Only Logic** – Built entirely in React with `localStorage` persistence for decision history and XP tracking

### 🏛️ Verified Public Governance Portals & Official Data Sources
Every section now includes a clear **Section Purpose & Guide** banner detailing its purpose, usage steps, and official data provenance:

| Portal / Section | Route | Official Authenticated Source | Geographic Scope |
| :--- | :--- | :--- | :--- |
| **Transit Stops** | `/transport` | OpenStreetMap Overpass (Live GPS) + Delhi DTC GTFS | Dynamic GPS Nearby (Nationwide) + Delhi |
| **Train Schedules** | `/train` | Ministry of Railways / data.gov.in | All India Indian Railways Network |
| **Govt Schemes** | `/govt-schemes` | Ministry of Social Justice & Empowerment (data.gov.in) | All 28 States & 8 UTs |
| **Union Budget** | `/budget` | Rajya Sabha / Ministry of Finance (sansad.in) | Union & State Allocations |
| **Disaster Relief & NFSA** | `/sdrf` | Ministry of Home Affairs & Consumer Affairs | State & District-wise Quotas |
| **Civic Statistics** | `/civic-stats` | Census of India & Ministry of Jal Shakti | National & State Indicators |
| **School Data** | `/school` | UDISE+ / Ministry of Education (udiseplus.gov.in) | State, District & Block Level |
| **Voter & Election Portal** | `/elections-info` | Election Commission of India (eci.gov.in) | National & Constituency Level |
| **Vehicle Services** | `/vehical` | MoRTH Parivahan Seva / Vahan / Sarathi | All State & UT RTOs |
| **Emergency Services** | `/nearby-services`| OpenStreetMap Overpass Geocoder | Live 10km GPS Radius |

### 🗳️ Community Civic Voting & Lost-and-Found
- **City & Area Filtering**: Toggle between **"📍 In My City / Area"** (auto-detected from your verified profile) and **"🌐 All Areas / Nationwide"**.
- **Live Civic Upvoting**: Real-time community upvoting on reported municipal hazards (potholes, streetlights, sanitation issues) to elevate municipal priority.
- **Lost & Found Registry**: Area-based notices to reunite lost belongings with citizens.

### 🛡️ Unified Navigation & Admin Sync
- **Smart Back Navigation**: Integrated universal `BackButton` component across all subpages with history detection and dashboard fallback.
- **Live Admin Redressal**: Real-time status updates (*Pending → In Progress → Resolved → Rejected*) synchronized between the Admin Dashboard and Citizen's *My Complaints* portal.

## 🛠️ Tech Stack  
### Frontend  
- React.js  
- Tailwind CSS – Modern responsive UI  
- Leaflet.js – Interactive maps for location tagging  

### Backend  
- Node.js + Express.js  
- PostgreSQL – Relational DB for reports and user data  
- JWT Authentication – Secure role-based access
- Multer – File upload handling
- Swagger – API documentation
- Helmet.js – Security middleware
- Express Rate Limit – API protection

### Integrations  
- Cloudinary – Image uploads and hosting  
- JWT Authentication – Secure role-based access

## 🔧 Backend API Features

Detailed backend setup, environment configuration, database schemas, and complete API endpoint documentation can now be found in the [Backend Documentation](./backend/README.md).

## 🌗 Dark Mode Toggle  
**Implementation**:  
- `darkMode: 'class'` in `tailwind.config.js`  
- User preference saved via `localStorage`  
- Toggle switch: `src/ThemeToggle.jsx` (used in `Home.jsx`)  

**How to Use**:  
1. Locate the toggle button (🌙/☀️) in the header  
2. Click to switch between:  
   - **Light Mode**: White/light gray backgrounds (`bg-slate-50`) with dark text (`text-gray-900`)  
   - **Dark Mode**: Dark gray backgrounds (`dark:bg-gray-800`) with light text (`dark:text-gray-100`)  

## 🚀 Getting Started  

![Image](https://github.com/user-attachments/assets/2cd2d4e6-f9b4-4322-aad2-5475277ce2ff)
*Caption: Admin dashboard with issue management tools*

### Prerequisites  
- Node.js 16+  
- npm 8+  
- PostgreSQL 14+  
- Cloudinary account (for image uploads)






### Testing
*   **Backend Testing:** Jest, Supertest, MongoDB Memory Server
*   **Frontend Unit/Component Testing:** Vitest, React Testing Library
*   **Frontend E2E Testing:** Cypress

---


## ✅ Running Tests

We have a comprehensive testing suite to ensure code quality and stability.

### Backend Tests (Jest & Supertest)

These tests cover the API endpoints. They run against an in-memory MongoDB database to ensure a clean, isolated environment for each test run, preventing any impact on your development database.

To run all backend tests, navigate to the `/backend` directory and run:
```sh
npm test
```

### Frontend Unit & Component Tests (Vitest)

These tests verify that individual React components render and behave correctly in isolation. We use Vitest and React Testing Library for this.

To run all frontend unit tests, navigate to the `/frontend` directory and run:
```sh
npm test
```

### Frontend End-to-End (E2E) Tests (Cypress)

E2E tests simulate real user workflows in a browser from start to finish. This helps catch bugs in critical user journeys like logging in, creating a post, or navigating the application.

To open the Cypress Test Runner, navigate to the `/frontend` directory and run:
```sh
npm run cypress:open

### 📥 Installation  
📦 1.**Clone the repository**:  
   ```bash
   git clone https://github.com/Harshs16/civix.git
   cd Civix
  
📦 2. **Install Dependencies**

Make sure you have **Node.js** and **npm** installed.  
Then, install the project dependencies:

```bash

npm install

```



### 🌱 3. **Create a New Branch**
Use a meaningful branch name:
```bash

git checkout -b your-feature-name

```

Example:
```bash

git checkout -b improve-readme

```


 🛠️ 4. **Make Your Changes**
- Improve the code, fix bugs, or update docs.
- If you're running the project:
  ```bash

  npm start

  ```



 ✅ 5. **Stage and Commit**
```bash

git add .
git commit -m "feat: your clear and concise commit message"

```

🚀 6. **Push Your Branch**
```bash

git push origin your-feature-name

```

---

🔁 7. **Create a Pull Request**
- Go to your forked repo on GitHub
- Click **“Compare & pull request”**
- Add a helpful description of what you changed and why

---



## 📌 Roadmap / Future Enhancements  

- 🔔 Push notifications for issue updates  
- 📈 Analytics for civic issue trends  
- 🌐 Multilingual support  
- 📱 Mobile app (React Native) 

--- 

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

--- 

## 🌟 Our Awesome Contributors

<a href="https://github.com/Harshs16/civix/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Harshs16/civix" />
</a>

--- 

## 📄 License
MIT License. See LICENSE file for more details.

<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>

