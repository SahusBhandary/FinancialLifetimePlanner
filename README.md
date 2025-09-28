# Financial Lifetime Planner

A comprehensive web application for financial planning and lifetime scenario modeling, developed by Team 416NotFound for CSE416 Section 4, Spring 2025.

## Overview

The Financial Lifetime Planner is a full-stack web application that helps users create, manage, and analyze long-term financial scenarios. Users can model various financial situations including investments, income streams, expenses, retirement planning, and tax strategies to make informed financial decisions.

## Key Features

### Financial Planning
- Create and manage multiple financial scenarios
- Investment portfolio modeling with various asset types
- Income and expense tracking with inflation adjustments
- Retirement planning with RMD (Required Minimum Distribution) strategies
- Roth IRA conversion planning and optimization

### Investment Management
- Support for multiple investment types with customizable distributions
- Risk modeling with normal, uniform, fixed, and GBM distributions
- Expense ratio tracking and income distribution modeling
- Investment strategy ranking and optimization

### Tax Planning
- State-specific tax calculations
- Tax file upload and processing capabilities
- RMD strategy optimization for tax efficiency
- Social Security income modeling

### Scenario Management
- YAML-based scenario import/export
- Scenario sharing between users
- Life expectancy modeling with statistical distributions
- Marriage and spouse financial planning support

### User Experience
- Google OAuth authentication
- Responsive web interface built with React and Material-UI
- Profile management and user preferences
- File upload/download capabilities

## Technology Stack

### Frontend
- **React.js** - User interface framework
- **Material-UI (MUI)** - Component library for consistent design
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware with Google OAuth
- **YAML** - Scenario configuration format
- **Cheerio** - Web scraping for RMD data

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Create React App** - Frontend build tooling

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- MongoDB database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinancialLifetimePlanner
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Configure MongoDB connection
   - Set up Google OAuth credentials
   - Configure environment variables for backend

5. **Start the application**
   
   Backend server:
   ```bash
   npm start
   # Server runs on http://localhost:8000
   ```
   
   Frontend development server:
   ```bash
   cd frontend
   npm start
   # Frontend runs on http://localhost:3000
   ```

## Usage

### Getting Started
1. Visit the application at `http://localhost:3000`
2. Sign in with your Google account
3. Complete your user profile setup
4. Begin creating financial scenarios

### Creating Scenarios
1. Navigate to the Planning section
2. Fill out scenario parameters including:
   - Personal information (birth year, marriage status, life expectancy)
   - Investment types and allocations
   - Income and expense streams
   - Tax considerations and state of residence
3. Configure advanced options like RMD strategies and Roth conversions
4. Save and analyze your scenario

### Managing Data
- **Export**: Download scenarios as YAML files for backup or sharing
- **Import**: Upload YAML scenario files to recreate or modify existing plans
- **Share**: Share scenarios with other users via email
- **Profile**: View and manage all your scenarios from your profile page

## Project Structure

```
FinancialLifetimePlanner/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── Components/      # Reusable React components
│   │   ├── Pages/           # Main application pages
│   │   └── store/           # Context API for state management
├── server/                  # Backend server code
│   ├── models/              # MongoDB data models
│   ├── routes/              # API route handlers
│   └── exportScenario.js    # Scenario export functionality
└── README.md
```

## Data Models

### Core Entities
- **User**: User profiles with Google authentication
- **Scenario**: Financial planning scenarios with all parameters
- **Investment**: Investment definitions and allocations
- **InvestmentType**: Asset class definitions with return distributions
- **EventSeries**: Income/expense streams over time

## API Features

### Authentication
- Google OAuth 2.0 integration
- Session-based user management

### Scenario Operations
- CRUD operations for scenarios
- YAML import/export functionality
- Scenario sharing between users

### File Management
- Tax file upload and processing
- Scenario file download capabilities

## Development Team

**Team 416NotFound**  
CSE416 Section 4, Spring 2025

## License

This project is part of an academic course and is intended for educational purposes.

## Support

For questions, issues, or feature requests, please contact the development team or create an issue in the repository.
