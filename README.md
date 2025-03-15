# Features

Job Scraper – Automatically scrapes jobs from Naukri.com every 24 hours
✅ Full-Stack App – Built using Next.js, Express.js, MongoDB, and Tailwind CSS
✅ Pagination & Filtering – View jobs with sorting and filtering options
✅ Dark Mode – Modern UI with a black background and light-colored job cards
✅ Deployments – Frontend on Vercel | Backend on Render

# Tech-Stack

Frontend: Next.js, Tailwind CSS
Backend: Express.js, Node.js
Database: MongoDB
Web Scraping: Cheerio, Puppeteer
Deployment: Vercel

# Getting Started

1️⃣ Clone the Repository
git clone https://github.com/yourusername/job-board.git
cd job-board

2️⃣ Backend Setup
cd backend
npm install

Configure Environment Variables
Create a .env file inside the backend folder and add:
MONGO_URI=your_mongodb_connection_string
PORT=5000

3️⃣ Frontend Setup
cd frontend
npm install

Configure Environment Variables
Create a .env.local file inside the frontend folder and add:
NEXT_PUBLIC_API_URL=https://your-backend-url/api

4️⃣ Run the Application

Start Backend
cd backend
npm start

Start Frontend
cd frontend
npm run dev

The application will be available at:
Frontend: http://localhost:3000
Backend: http://localhost:5000/api/jobs
