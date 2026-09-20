# Zentora - PPT Content

## Ready-to-use AI PPT prompt

Create a professional 12-slide academic project presentation for **Zentora**, a modern freelance marketplace web application that connects clients with freelancers. Use a clean contemporary design with teal, coral, orange and deep navy accents, minimal text, dashboard-style UI visuals, icons for users/projects/bids/payments, and a consistent 16:9 layout. The presentation should feel like a real software engineering project demonstration, not a marketing advertisement.

Include these slides:

1. Title: Zentora - Freelance Marketplace Platform
2. Problem Statement and Motivation
3. Project Objectives
4. System Users and Roles
5. Key Features
6. Technology Stack
7. System Architecture and Data Flow
8. Client Workflow
9. Freelancer Workflow
10. Admin Dashboard and Management
11. Security, Validation and Payments
12. Future Scope and Conclusion

Use concise bullet points, architecture diagrams, workflow arrows, feature icons and realistic dashboard mockups. Mention that the frontend uses React and Vite, the backend uses Node.js and Express, and data can use MongoDB or a local JSON fallback for development. Do not invent features that are not listed. Add speaker notes with 2-3 sentences per slide. End with a Thank You / Q&A slide if an extra slide is useful.

## Slide-by-slide content

### Slide 1 - Title
- Zentora
- Freelance Marketplace Platform
- Connecting clients with skilled freelancers
- Full-stack web application
- Presented by: [Your Name]
- Technology: React, Vite, Node.js and Express

### Slide 2 - Problem Statement
- Clients need a simple way to publish projects and find suitable talent.
- Freelancers need a single platform to discover projects and submit bids.
- Manual hiring workflows make project tracking and bid management difficult.
- Zentora brings project posting, bidding, plans and administration into one platform.

### Slide 3 - Project Objectives
- Build a role-based freelance marketplace.
- Allow clients to post and manage projects.
- Allow freelancers to browse projects and place bids.
- Provide administrators with platform-level management tools.
- Protect accounts using authentication, password hashing and JWT authorization.
- Support credit-based bidding and plan purchases.

### Slide 4 - Users and Roles
- Client: posts projects, reviews bids, hires freelancers and updates profile.
- Freelancer/User: browses open projects, places bids, tracks bids, buys credit plans and manages profile.
- Admin: monitors platform statistics and manages users, clients, projects, bids and plans.
- Role-based routes prevent users from opening dashboards belonging to another role.

### Slide 5 - Key Features
- Landing page with hero section, categories, trending content, testimonials, partners and articles.
- Registration and login for clients and freelancers.
- Email OTP request and verification flow.
- Client project creation with title, description, budget and duration.
- Freelancer project browsing and bid submission.
- Client bid review with accept/reject actions.
- Dashboard KPIs for projects, bids, deals, credits and earnings.
- Freelancer plans and credit-based bidding.
- Admin management for users, clients, projects, bids and plans.
- Profile update including contact details, bio and password change.
- Responsive UI with Bootstrap components and React Icons.

### Slide 6 - Technology Stack

#### Frontend
- React 19
- Vite 8
- React Router DOM
- Axios for API communication
- Bootstrap 5 for responsive layout
- React Icons for interface icons
- React Hook Form and Yup for forms and validation
- SweetAlert2 for user notifications
- Typewriter Effect for landing-page interaction

#### Backend
- Node.js
- Express 5
- CORS
- JWT for authentication
- bcryptjs for password hashing
- Nodemailer for optional SMTP email delivery
- Razorpay SDK for optional payment integration

#### Data and tools
- MongoDB support for production-style persistence
- JSON file database fallback for local development
- ESLint for code quality
- Concurrently for running frontend and API together

### Slide 7 - System Architecture and Data Flow
- User interacts with the React/Vite frontend.
- React Router loads public or role-specific pages.
- Axios sends HTTP requests to the Express REST API on port 9000.
- JWT bearer token authenticates protected API requests.
- Express reads and updates users, plans, projects and bids.
- MongoDB is supported; local development can use server/data/db.json.
- API response returns success status, result data and messages.

Suggested diagram:

User -> React UI -> Axios -> Express REST API -> Authentication Middleware -> MongoDB / JSON Database

### Slide 8 - Client Workflow
1. Register or log in as a client.
2. Open the client dashboard.
3. Post a project with description, budget and duration.
4. View projects and received bids.
5. Review freelancer bid details.
6. Accept a bid to finalize the deal or reject it.
7. Update profile information when needed.

### Slide 9 - Freelancer Workflow
1. Register or log in as a freelancer.
2. View available open projects.
3. Select a suitable project.
4. Spend one credit to place one bid.
5. Track submitted bids and their status.
6. Purchase a plan to add more credits.
7. Manage personal profile and password.

### Slide 10 - Admin Dashboard
- Platform statistics: freelancers, clients and live projects.
- View and manage registered freelancers.
- View and manage registered clients.
- Activate or deactivate user accounts.
- Delete user records where permitted.
- View projects and bids across the platform.
- Create and delete freelancer credit plans.
- Maintain admin profile details.

### Slide 11 - Security, Validation and Payments
- JWT tokens expire after seven days.
- Protected routes require a valid logged-in user and matching role.
- Passwords are hashed with bcryptjs before storage.
- API authentication uses the Bearer token header.
- Email OTP has a ten-minute expiry window.
- Form inputs are validated before submission.
- Duplicate bids are blocked.
- Credit balance is checked before a bid is created.
- Razorpay order creation and signature verification are supported when keys are configured.
- SMTP and MongoDB are configurable through environment variables.

### Slide 12 - Future Scope and Conclusion
- Add real-time chat between clients and freelancers.
- Add ratings, reviews and freelancer portfolios.
- Add advanced project search and category filters.
- Add notifications for bid updates and hiring decisions.
- Add stronger payment reconciliation and transaction history.
- Deploy frontend, API and MongoDB to cloud infrastructure.
- Zentora provides a complete foundation for a scalable freelance marketplace.
- Thank You - Questions?

## Short viva explanation

Zentora is a full-stack freelance marketplace. React and Vite power the frontend, while Node.js and Express provide REST APIs. The system supports three roles: client, freelancer and admin. Clients post projects and choose from freelancer bids, freelancers browse projects and use credits to place bids, and admins manage the entire platform. JWT authentication, bcrypt password hashing, OTP verification, input validation and optional Razorpay payment verification provide the security and transaction foundation.

## Important implementation note

For the presentation, describe MongoDB, SMTP and Razorpay as supported integrations. In local development, the API can run with `server/data/db.json` when MongoDB is unavailable, and payment/email integrations require their environment variables and credentials.
