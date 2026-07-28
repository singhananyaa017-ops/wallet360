require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

connectDB();

const app = express();

const allowedOrigins = [
  'https://wallet360-nu.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);
const incomeRoutes = require('./routes/incomeRoutes');
app.use('/api/income', incomeRoutes);
const budgetRoutes = require('./routes/budgetRoutes');
app.use('/api/budgets', budgetRoutes);
const savingsGoalRoutes = require('./routes/savingsGoalRoutes');
app.use('/api/savings-goals', savingsGoalRoutes);
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);
const insightsRoutes = require('./routes/insightsRoutes');
app.use('/api/insights', insightsRoutes);
const recurringRoutes = require('./routes/recurringRoutes');
app.use('/api/recurring', recurringRoutes);
const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => {
  res.send('Wallet360 API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});