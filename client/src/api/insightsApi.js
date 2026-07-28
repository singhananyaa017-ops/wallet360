import api from './axios';

export const getInsights = (month, year) =>
  api.get(`/insights?month=${month}&year=${year}`);