# Coll8 AI Hiring Platform - Setup Guide

## Full-Stack Features

✅ **Authentication & Authorization**
- Email/password signup and login
- Role-based access control (Candidate, Recruiter, Admin)
- Protected routes based on user roles
- Auto-confirm email for testing

✅ **Database Integration**
- Jobs table with CRUD operations
- Candidates table with profiles
- Matches table for AI-powered matching
- Row-Level Security (RLS) policies
- Automatic profile creation on signup

✅ **Backend APIs**
- AI matching edge function (`ai-match-candidates`)
- Real-time data fetching
- Secure role-based queries

✅ **Role-Based Features**

**Recruiters & Admins:**
- Post and manage jobs
- View all candidates
- Run AI matching
- View match analytics

**Candidates:**
- View dashboard
- Profile created automatically

## Quick Start

### 1. Sign Up
Navigate to `/auth` and create an account. Select your role:
- **Candidate**: Job seekers
- **Recruiter**: Hiring managers
- **Admin**: Full access

### 2. Post Jobs (Recruiters/Admins only)
- Go to Jobs page
- Click "Post New Job"
- Fill in job details

### 3. Run AI Matching (Recruiters/Admins only)
- Go to AI Matching page
- Select a job
- Click "Run AI Matching"
- View scored candidates with AI rationale

## Test Data

Create test accounts with different roles to see role-based access in action:

```
Recruiter: recruiter@example.com / password123
Admin: admin@example.com / password123
Candidate: candidate@example.com / password123
```

## Architecture

- **Frontend**: React + TypeScript + Tailwind
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with RLS
- **AI**: Lovable AI Gateway (Gemini 2.5 Flash)
- **Auth**: Supabase Auth with role assignment

## Security

- Row-Level Security on all tables
- Role-based access control
- Secure authentication flow
- Audit trails for AI decisions
