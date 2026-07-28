import api from './axios';

export const getGoals = () => api.get('/savings-goals');
export const createGoal = (data) => api.post('/savings-goals', data);
export const contributeToGoal = (id, amount) => api.post(`/savings-goals/${id}/contribute`, { amount });
export const updateGoal = (id, data) => api.put(`/savings-goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/savings-goals/${id}`);