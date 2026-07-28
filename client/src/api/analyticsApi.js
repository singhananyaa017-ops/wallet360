import api from './axios';

export const getMonthlyAnalytics = (month, year) =>
  api.get(`/analytics/monthly?month=${month}&year=${year}`);

export const getIncomeVsExpense = (month, year) =>
  api.get(`/analytics/income-vs-expense?month=${month}&year=${year}`);

export const getMonthlyComparison = (month, year) =>
  api.get(`/analytics/monthly-comparison?month=${month}&year=${year}`);

export const getYearlyAnalytics = (year) =>
  api.get(`/analytics/yearly?year=${year}`);