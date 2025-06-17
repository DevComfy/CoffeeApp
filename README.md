# Meeting & Beverage Notifier

A modern, network-accessible application for scheduling meetings and managing beverage orders across your organization. Built with React, TypeScript, and Express, featuring a beautiful glass-morphism UI design.

## 🚀 Features

- Schedule meetings with beverage orders
- Real-time synchronization across network devices
- Dashboard for meeting management
- Printable meeting reports
- Beautiful glass-morphism UI design
- Network-accessible application

## 🛠️ Technical Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Styling: TailwindCSS
- State Management: React Hooks
- Network Communication: REST API

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Network access for multi-device functionality

## 🔧 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## ⚙️ Configuration

The application runs on two ports:
- Frontend (Vite): 3651
- Backend (Express): 3651

You can modify these in:
- `vite.config.ts` for frontend
- `config.json` for backend

## 🚀 Running the Application

1. Start the backend server:
```bash
node server.js
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

The application will be accessible at:
- Local: http://localhost:3651
- Network: http://<your-ip>:3651

## 📱 Application Structure

### 1. Meeting Scheduling
- Date and time selection
- Meeting duration
- Boardroom selection
- Beverage ordering system
- Recurring meeting option

### 2. Beverage Management
- Quick-add options
- Customizable orders
- Multiple beverage types:
  - Coffee (with milk/sugar options)
  - Tea (with milk/sugar options)
  - Water (still/sparkling)

### 3. Dashboard
- Meeting overview
- Status management (scheduled/completed/cancelled)
- Quick actions
- Meeting details view

### 4. Print View
- Printable meeting schedules
- Filterable by date and boardroom
- Export to JSON
- Print-optimized layout

## 🔄 Data Synchronization

The application uses a JSON file-based storage system that enables:
- Cross-device access
- Real-time updates
- Data persistence
- Network synchronization

## 🎨 UI Features

- Glass-morphism design
- Responsive layout
- Dark mode optimized
- Interactive animations
- Print-friendly styles

## 📝 API Endpoints

- GET `/api/meetings` - Retrieve all meetings
- POST `/api/meetings` - Create/Update meetings

## 👥 Usage

1. **Schedule a Meeting**
   - Select date/time
   - Choose boardroom
   - Add beverages
   - Set recurring if needed

2. **Manage Meetings**
   - View all meetings in dashboard
   - Update meeting status
   - Cancel/restore meetings
   - View detailed information

3. **Print/Export**
   - Filter meetings by date/boardroom
   - Print schedules
   - Export data to JSON

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
