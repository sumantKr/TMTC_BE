TMTC Full Stack Developer Assignment: Travel Itinerary Report App
Objective:
Build a full-stack application that allows users to create, view, and manage travel itineraries.
Stack:
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js (Express) + MongoDB
- Testing: Jest (backend), Cypress/Playwright (frontend - optional bonus)
- DevOps: Dockerize the app (bonus)
TASK BREAKDOWN

1. AUTHENTICATION:
- Implement user sign up and login using JWT.
- Protect API routes using middleware.
2. ITINERARY CRUD:
- Build a form to create an itinerary (title, destination, startDate, endDate).
- List itineraries for the logged-in user on a dashboard.
- Allow user to edit/delete an itinerary.
3. DASHBOARD VISUALIZATION:
- On the dashboard, show basic stats for the user: total itineraries, upcoming trips, etc.
- Display itineraries in a calendar or timeline format as a bonus.
4. SEO:
- Set meta title and description dynamically.
- Add basic schema.org markup for the itinerary details page.
- Implement server-side rendering (SSR) where appropriate.
5. TESTING (BONUS):
- Write unit tests for backend logic (controllers, services).
- Optionally write 1-2 tests for critical frontend interactions (e.g., form submission).

6. DOCKER (BONUS):
- Dockerize the backend and frontend apps.
- Use docker-compose to run MongoDB alongside the services.
7. NICE TO HAVE (Optional Bonus Features):
- Pagination on itinerary list page.
- Responsive mobile layout.
- Sort or filter itineraries by date or destination.
DELIVERABLES:
- GitHub repo link
- Clear README with setup instructions
- Postman collection or example curl requests for APIs (if applicable)
- Optional: live demo (Vercel, Render, etc.)