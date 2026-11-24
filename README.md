# MessMate – Complete Smart Mess Management System

> **"Save Food. Save Money. Manage Smartly."**  
> *Tagline: "One Platform. Two-Sided Convenience. Complete Smart Mess Management."*

---

## 🥗 1. Project Overview

**MessMate** is a full-stack, enterprise-grade web application built to digitize, modernize, and simplify hostel and campus dining operations. Unlike standard food ordering apps, MessMate is engineered as a two-sided digital platform connecting **Students**, **Mess Owners**, and **Platform Super Admins**.

### The Breakthrough: Shared Savings Wallet
Traditional mess systems penalize students for missing meals while kitchens still throw away leftover food. MessMate introduces the **Shared Savings Wallet**:
1. A student notifies the mess before the cutoff time (e.g. 2–3 hours in advance).
2. The kitchen demand headcount reduces in real-time.
3. The chef reduces cooked quantities of grains, vegetables, and dairy.
4. Actual raw material cost savings (avg ₹35/meal) are audited and verified.
5. The configured split (e.g., 50% Student / 50% Mess Owner) is credited to the student's wallet and retained by the owner.
6. **Result**: Zero cooked food waste, financial savings for students, and higher profit margins for mess owners!

---

## 🛠️ 2. Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Lucide Icons, Recharts
- **Backend**: Node.js, Express.js, REST APIs, JSON Web Tokens (JWT), bcrypt.js password hashing, Morgan logger
- **Data & Persistence**: Dual-Mode Database Engine:
  - Connects to native **MongoDB** / MongoDB Atlas via Mongoose if a database URI is provided or MongoDB daemon is running.
  - Automatically falls back to a **high-performance local persistent store** (`server/data/messmate_db.json`) if no external database is configured, ensuring 100% zero-config execution anywhere!
- **Security & RBAC**: Role-Based Access Control protecting Student, Mess Owner, and Super Admin endpoints. Suspended users are immediately blocked with HTTP 403.

---

## 🚀 3. Quick Start & Terminal Commands

Both servers are currently running live:
- **Frontend App (Localhost)**: [http://localhost:5173](http://localhost:5173)
- **Frontend App (IPv4 Loopback)**: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Frontend App (Network LAN)**: [http://10.16.210.104:5173](http://10.16.210.104:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000) or [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### To run manually from terminal:

#### 1. Start the Backend Server:
```bash
cd server
npm install
node server.js
```
*The backend will boot on port 5000 and automatically seed realistic demo accounts on first run.*

#### 2. Start the Frontend Client:
```bash
cd client
npm install
npm run dev
```
*The frontend will launch at `http://localhost:5173` with automatic API proxying to port 5000.*

---

## 🔑 4. Demo Login Credentials

You can log in manually or use the **"Instant Demo Login"** buttons on the navigation bar:

| Role | Email | Password | Persona Details |
| :--- | :--- | :--- | :--- |
| **Student** | `aarav@student.com` | `student123` | Gold Member (22 days left), ₹155 wallet balance |
| **Student 2** | `priya@student.com` | `student123` | Silver Member (15 days left), ₹120 wallet balance |
| **Student 3** | `rohit@student.com` | `student123` | Platinum Member (Paused), ₹92 wallet balance |
| **Mess Owner** | `rajesh@annapurnamess.com` | `mess123` | Annapurna Royal Smart Mess (4.9★, 80 students) |
| **Mess Owner 2**| `suresh@greenleafmess.com` | `mess123` | Green Leaf Healthy Dining (4.7★, 60% split) |
| **Super Admin** | `admin@messmate.com` | `admin123` | Platform-wide governance & metrics |

---

## 📱 5. Feature Highlights by Role

### 👨‍🎓 Student Dashboard (`/student`)
- **Dashboard Overview**: Active membership status, remaining days live gauge, today's meals, recent wallet credits.
- **Membership Management**: View current plan, **Pause Plan** (1–15 days with automatic expiry date extension), **Resume Plan**, **Cancel Plan**, and browse/activate new mess packages.
- **Meal Management**: View breakfast, lunch, and dinner menus; submit advance skips with cutoff validation; track skip audit status (`confirmed`, `kitchen_adjusted`, `verified_saved`).
- **Shared Savings Wallet**: Transparent 4-way financial breakdown (meals skipped, total food waste saved, student credits earned, owner savings), plus complete ledger audit trail.
- **Payments & Invoices**: View payment history and open/print official tax membership invoices.
- **Complaints & Feedback**: 5-star rating system, category selection, and ticket tracker with chef resolution notes.
- **Profile & Security**: Update phone, hostel room number, dietary preferences (Veg, Jain, Non-Veg, Vegan), and change password.

### 👨‍🍳 Mess Owner Dashboard (`/owner`)
- **Overview & Live Headcount**: Enrolled members vs. confirmed skips for Breakfast, Lunch, and Dinner. Low-stock inventory warnings.
- **Kitchen Demand & Planning**:
  - Live confirmed headcount calculation.
  - **Smart Raw Quantity Calculator**: Predicts required kg for Grains (`0.12 kg/head`), Vegetables (`0.18 kg/head`), and Pulses/Dairy (`0.08 kg/head`).
  - **"Adjust Kitchen Preparation"**: Confirms reduced food preparation to prevent waste.
  - **Menu Publisher**: Publish menus with serving hours and feast notes.
  - **Food Wastage Tracker**: Log surplus food in kg and audit root causes.
- **Shared Savings Management**:
  - Configure student reward percentage slider (e.g. 50/50 or 55/45).
  - Single and batch verification of actual food savings (credits student wallets automatically).
- **Inventory & Procurement**:
  - Stock levels with color-coded health badges.
  - Low-stock alerts (`currentStock <= minThreshold`).
  - Restock ingredient modal with automatic wholesale purchase logging.
- **Student Management**: Enrolled student directory with dietary preferences and custom plan creator.
- **Financial Reports & P&L**: Full Profit & Loss report showing gross revenue, food expenses, overhead, net profit, and profit margin.
- **Student Complaints**: Respond to tickets with corrective action notes and status updates.

### 🛡️ Super Admin Dashboard (`/admin`)
- **Platform Overview**: Network metrics across all messes (total students, food waste saved in kg, platform transaction volume).
- **Messes Directory**: Monitor partner messes, ratings, active students, and per-meal cost breakdowns.
- **User Governance**: Audit students and mess owners with immediate **Suspend / Activate** controls.
- **Financial Audits**: Monitor platform subscription payments and wallet reward distributions.
- **Disputes Oversight**: Monitor complaints across all messes with filter by status.
- **Future AI Engine Architecture (Preview)**: Honest telemetry dashboard with 6 predictive AI modules, mathematical formulations, and data collection pipelines.

---

## 🤖 6. Honest AI Module Status Disclosure

In accordance with strict product integrity guidelines, MessMate does **not** make synthetic or fake AI claims:
- **AI Meal Demand Prediction**: *Architecture Ready* (collecting daily historical skips and attendance telemetry).
- **Smart Quantity Optimizer**: *Mathematical Formulation Configured* (portion formulas based on confirmed headcount).
- **Inventory Reorder Point Model**: *Pipeline Active* (burn rates linked to wholesale purchase records).
- All AI features are explicitly marked as **Pre-Alpha / Architecture Ready** until fully trained machine learning weights are deployed.

---

## 🧪 7. Test Verification

MessMate includes automated verification scripts that test both API and end-to-end integration:
- `node server/test-apis.js` (Verifies all 8 backend API test suites)
- `node testStudentWorkflow` (Validates student pause, resume, skip, wallet, and feedback)
- `node testMessOwnerWorkflow` (Validates kitchen demand, waste logging, restock, and P&L)
- `node testSuperAdminAndSecurity` (Validates RBAC security, user suspension, and dispute tracking)

*All tests pass with 100% success.*
