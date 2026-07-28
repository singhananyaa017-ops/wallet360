# Wallet360

A full-stack personal finance tracker for logging expenses and income, setting monthly budgets, tracking savings goals, and visualizing spending patterns — built on the MERN stack.

**Live demo:** https://wallet360-nu.vercel.app/
**Backend API:** https://wallet360-server.onrender.com

---

## Features

- **Dashboard** — balance, income, and expense overview with income-vs-expense and category breakdown charts
- **Transactions** — add, categorize, and delete income/expense entries with merchant, payment method, date, and notes
- **Recurring transactions** — automate monthly bills, subscriptions, and salary entries
- **Budgets** — set monthly category limits and track usage in real time
- **Savings goals** — create targets with deadlines and track progress with incremental contributions
- **Analytics** — monthly insights, spending by category, average daily spend, and yearly trend view

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT |
| Charts | Recharts |
| Deployment | Vercel (frontend), Render (backend) |

## Project structure

```
wallet360/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── server/              # Express API backend
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── savingsGoalRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── insightsRoutes.js
│   │   ├── recurringRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting started locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/wallet360.git
cd wallet360
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

```bash
npm start
```

### 3. Frontend setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

## API overview

| Route prefix | Description |
|---|---|
| `/api/auth` | Register, login, JWT-based authentication |
| `/api/expenses` | Create, list, and delete expense entries |
| `/api/income` | Create, list, and delete income entries |
| `/api/budgets` | Set and track monthly category budgets |
| `/api/savings-goals` | Create and track savings goals |
| `/api/analytics` | Monthly analytics summaries |
| `/api/insights` | Smart spending insights |
| `/api/recurring` | Recurring transactions (bills, salary, subscriptions) |
| `/api/subscriptions` | Subscription tracking |

> Update this with specific method + path + body details for each route as you finalize them (e.g. `POST /api/expenses` — body: `{ amount, category, merchant, date, notes }`).

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com), pointed at the `client/` directory, with `VITE_API_URL` set to the live backend URL.
- **Backend** is deployed on [Render](https://render.com), pointed at the `server/` directory, with `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV=production` set as environment variables.

## Roadmap

- [ ] Export transactions to CSV
- [ ] Multi-currency support
- [ ] Shared/household budgets
- [ ] Push notifications for budget overruns

## License

MIT

## Author

Built by Ananya Singh.