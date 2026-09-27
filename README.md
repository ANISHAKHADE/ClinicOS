# ClinicOS — Clinic Management System

ClinicOS is a modern, responsive clinic and healthcare coordination dashboard built with React, TypeScript, Vite, and Tailwind CSS.

It provides a single interface for managing patient records, appointments, ambulance requests, blood requirements, hospital information, and emergency cases.

> Project status: Frontend/demo application with browser-based persistence. It currently uses seeded demo data and localStorage; it does not use a production backend or database.

---

## Features

### 📊 Dashboard

- Overview of clinic activity and operational statistics
- Today's appointments
- Active emergencies
- Pending ambulance requests
- Open blood requirements
- Upcoming appointments
- Recent emergency activity
- Quick navigation to major workflows

### 👥 Patient Management

- Add new patients
- Edit patient information
- View detailed patient records
- Delete patients
- Store:
  - Personal information
  - Contact details
  - Blood group
  - Allergies
  - Emergency contacts
  - Clinical notes
- Book appointments directly from a patient record

### 📅 Appointment Management

- Create appointments
- Associate appointments with patients
- Assign doctors
- Set appointment date and time
- Track appointment status:
  - Scheduled
  - Confirmed
  - Completed
  - Cancelled
  - No-Show
- Add notes and follow-up information
- Print appointment slips

### 🚑 Ambulance Coordination

- Create ambulance requests
- Record pickup and destination locations
- Set urgency levels
- Track dispatch status
- Assign ambulance units
- Maintain requester and patient information

Supported ambulance statuses:

- Pending
- Dispatched
- En-Route
- Arrived
- Completed
- Cancelled

### 🩸 Blood Bank

- Browse blood-bank information
- View available blood groups
- View emergency-service availability
- Create blood requirements
- Track blood requirements as:
  - Active
  - Fulfilled
  - Expired
- Record urgency, location, contact information, and required units

### 🏥 Hospital Directory

- View hospitals and healthcare facilities
- Hospital type
- Distance information
- Emergency availability
- ICU availability
- Specialties
- Operating hours
- Contact information

### 🚨 Emergency Management

- Register emergency requests
- Categorize emergencies:
  - Medical
  - Ambulance
  - Blood
  - General
- Set priority
- Assign responsible personnel
- Track status:
  - Open
  - In-Progress
  - Resolved
  - Closed
- Add resolution notes

### 🎨 UI / UX

- Responsive layout
- Sidebar navigation
- Dark-mode-compatible styling
- Reusable UI components
- Toast notifications
- Modal-based forms
- Loading and empty states
- Status badges
- Patient avatars
- Print-friendly appointment slip workflow

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling and responsive UI |
| Lucide React | Icons |
| date-fns | Date formatting and relative-time utilities |
| clsx | Conditional class composition |
| Motion | UI animation |
| localStorage | Client-side data persistence |

### AI / Gemini

The project contains the `@google/genai` package and an `.env.example` with `GEMINI_API_KEY` configuration because the project was prepared in Google AI Studio.

Important: the current application source does not make an active Gemini API call.

The application should therefore currently be treated as a frontend clinic-management demo rather than an AI-powered clinical system.

---

## Project Structure

```text
ClinicOS/
├── index.html
├── package.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
│
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    │
    ├── components/
    │   ├── appointments/
    │   │   ├── AppointmentFormModal.tsx
    │   │   └── PrintSlipModal.tsx
    │   │
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── ToastContainer.tsx
    │   │
    │   ├── patients/
    │   │   ├── PatientAvatar.tsx
    │   │   ├── PatientDetailModal.tsx
    │   │   └── PatientFormModal.tsx
    │   │
    │   ├── ui/
    │   │   ├── Badge.tsx
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── Input.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Select.tsx
    │   │   ├── StatCard.tsx
    │   │   └── Table.tsx
    │   │
    │   └── views/
    │       ├── DashboardView.tsx
    │       ├── PatientsView.tsx
    │       ├── AppointmentsView.tsx
    │       ├── AmbulanceView.tsx
    │       ├── BloodBankView.tsx
    │       ├── HospitalsView.tsx
    │       └── EmergencyView.tsx
    │
    ├── lib/
    │   ├── storage.ts
    │   └── utils.ts
    │
    └── types/
        └── index.ts
