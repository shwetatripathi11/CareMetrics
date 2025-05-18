# CareMetrics

A comprehensive healthcare management system for tracking patient care, prescriptions, and medical records. Built with React, TypeScript, and Supabase.

## Features

- 🏥 Doctor and Patient Management
- 📝 Digital Prescription Creation
- 🔄 Real-time Updates
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure Authentication with Supabase

## Tech Stack

- React
- TypeScript
- Supabase (Backend & Authentication)
- Tailwind CSS
- Framer Motion
- date-fns

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd care-metrics
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

## Environment Setup

Make sure to set up the following environment variables in your deployment platform:

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Database Schema

The application uses the following main tables:

- `doctors`: Stores doctor information
- `patients`: Manages patient records
- `prescriptions`: Links doctors with patients and stores prescription details

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

## License

MIT
