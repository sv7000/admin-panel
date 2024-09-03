# Admin Panel

## Overview

This project is an admin panel. It includes a login page, registration page, multi-step form with a progress indicator, and a submission table. The tech stack used includes ReactJS, NodeJS, ViteJS, Typescript, Tailwind CSS, and optionally Tailadmin.

## Features

- **Login Page**: Allows users to log in with email field validation and appropriate messages for login success and failure.
- **Registration Page**: Users can register with basic details and get redirected to the login page upon successful registration.
- **Multi-Step Form**: A 3-step form with progress indicator:
  - **Step 1**: Capture basic information (Name, Email, Phone number, Address).
  - **Step 2**: Multi-file upload (Allow up to 3 files with valid types PNG and PDF).
  - **Step 3**: Multi-field select dropdown.
- **Submission Table**: View form submissions with search and filter options based on the date of submission.

## Tech Stack

- **Frontend**: ReactJS, ViteJS, Typescript, Tailwind CSS 
- **Backend**: Xano
- **State Management**: Redux
- **Deployment**: 
  - Frontend: [Vercel](https://vercel.com/) 
  - Backend: Xano 

## Requirements

- [x] Ensure field validation for forms is implemented.
- [x] The web app must be responsive on all devices (Mobile, Tablet, Desktop).
- [x] Both frontend and backend should be deployed.

## Installation

To get started with this project:


   ```bash
   git clone https://github.com/your-username/admin-panel.git
   cd admin-panel
   npm install
   npm run dev
   ```
   
