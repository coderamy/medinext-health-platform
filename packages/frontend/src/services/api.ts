import axios from 'axios';
import { mockAPI } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK_API = true; // Using mock data - set to false when backend is available

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    USE_MOCK_API ? mockAPI.register(data) : api.post('/v1/auth/register', data),
  login: (data: { email: string; password: string }) =>
    USE_MOCK_API ? mockAPI.login(data) : api.post('/v1/auth/login', data),
  getMe: () => USE_MOCK_API ? mockAPI.getMe() : api.get('/v1/auth/me'),
  logout: () => USE_MOCK_API ? Promise.resolve({ data: { success: true } }) : api.post('/v1/auth/logout'),
};

// Patient API
export const patientAPI = {
  getAll: () => USE_MOCK_API ? mockAPI.getPatients() : api.get('/v1/patients'),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getPatients().then(res => ({ data: res.data.find((p: any) => p.id === parseInt(id)) })) : api.get(`/v1/patients/${id}`),
  create: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data } }) : api.post('/v1/patients', data),
  update: (id: string, data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), ...data } }) : api.put(`/v1/patients/${id}`, data),
  delete: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { success: true } }) : api.delete(`/v1/patients/${id}`),
};

// Provider API
export const providerAPI = {
  getAll: (params?: { specialization?: string; city?: string }) =>
    USE_MOCK_API ? mockAPI.getProviders(params) : api.get('/v1/providers', { params }),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getProviders().then(res => ({ data: res.data.find((p: any) => p.id === parseInt(id)) })) : api.get(`/v1/providers/${id}`),
  create: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data } }) : api.post('/v1/providers', data),
  update: (id: string, data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), ...data } }) : api.put(`/v1/providers/${id}`, data),
  getNearby: (lat: number, lng: number, radius?: string) =>
    USE_MOCK_API ? mockAPI.getProviders() : api.get(`/v1/providers/nearby/${lat}/${lng}`, { params: { radius } }),
};

// Appointment API
export const appointmentAPI = {
  getAll: (params?: { patientId?: string; providerId?: string }) =>
    USE_MOCK_API ? mockAPI.getAppointments() : api.get('/v1/appointments', { params }),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getAppointments().then(res => ({ data: res.data.find((a: any) => a.id === parseInt(id)) })) : api.get(`/v1/appointments/${id}`),
  create: (data: any) => USE_MOCK_API ? mockAPI.createAppointment(data) : api.post('/v1/appointments', data),
  update: (id: string, data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), ...data } }) : api.put(`/v1/appointments/${id}`, data),
  delete: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { success: true } }) : api.delete(`/v1/appointments/${id}`),
};

// Hospital API
export const hospitalAPI = {
  getAll: (params?: { city?: string; specialization?: string }) =>
    USE_MOCK_API ? mockAPI.getHospitals() : api.get('/v1/hospitals', { params }),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getHospitals().then(res => ({ data: res.data.find((h: any) => h.id === parseInt(id)) })) : api.get(`/v1/hospitals/${id}`),
  getBeds: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { total: 100, available: 25, occupied: 75 } }) : api.get(`/v1/hospitals/${id}/beds`),
};

// Pharmacy API
export const pharmacyAPI = {
  getAll: (params?: { city?: string }) =>
    USE_MOCK_API ? mockAPI.getPharmacies() : api.get('/v1/pharmacies', { params }),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getPharmacies().then(res => ({ data: res.data.find((p: any) => p.id === parseInt(id)) })) : api.get(`/v1/pharmacies/${id}`),
  getInventory: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { medicines: ['Paracetamol', 'Ibuprofen', 'Aspirin'] } }) : api.get(`/v1/pharmacies/${id}/inventory`),
  createOrder: (id: string, data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'pending' } }) : api.post(`/v1/pharmacies/${id}/orders`, data),
};

// Lab API
export const labAPI = {
  getAll: (params?: { city?: string }) =>
    USE_MOCK_API ? mockAPI.getLabs() : api.get('/v1/labs', { params }),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getLabs().then(res => ({ data: res.data.find((l: any) => l.id === parseInt(id)) })) : api.get(`/v1/labs/${id}`),
  getTests: (id: string) => USE_MOCK_API ? Promise.resolve({ data: ['Blood Test', 'X-Ray', 'MRI', 'CT Scan'] }) : api.get(`/v1/labs/${id}/tests`),
  bookTest: (id: string, data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'booked' } }) : api.post(`/v1/labs/${id}/book`, data),
  getResults: (id: string, testId: string) => USE_MOCK_API ? Promise.resolve({ data: { testId, result: 'Normal', date: new Date().toISOString() } }) : api.get(`/v1/labs/${id}/results/${testId}`),
};

// Blood Bank API
export const bloodBankAPI = {
  getInventory: () => USE_MOCK_API ? mockAPI.getBloodInventory() : api.get('/v1/blood-bank/inventory'),
  getBloodTypeInventory: (bloodType: string) => USE_MOCK_API ? mockAPI.getBloodInventory().then(res => ({ data: res.data[bloodType] || 0 })) : api.get(`/v1/blood-bank/inventory/${bloodType}`),
  registerDonor: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'registered' } }) : api.post('/v1/blood-bank/donors', data),
  getDonors: (params?: { bloodType?: string }) => USE_MOCK_API ? mockAPI.getBloodInventory() : api.get('/v1/blood-bank/donors', { params }),
  createRequest: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'pending' } }) : api.post('/v1/blood-bank/requests', data),
};

// Organ Donor API
export const organDonorAPI = {
  getAll: () => USE_MOCK_API ? mockAPI.getOrganDonors() : api.get('/v1/organ-donors'),
  getById: (id: string) => USE_MOCK_API ? mockAPI.getOrganDonors().then(res => ({ data: res.data.find((o: any) => o.id === parseInt(id)) })) : api.get(`/v1/organ-donors/${id}`),
  register: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'registered' } }) : api.post('/v1/organ-donors', data),
  search: (params: { organType: string; bloodType?: string }) => USE_MOCK_API ? mockAPI.getOrganDonors() : api.get('/v1/organ-donors/search', { params }),
  getWaitlist: () => USE_MOCK_API ? Promise.resolve({ data: [{ id: 1, patient: 'John Doe', organ: 'Kidney', priority: 'high' }] }) : api.get('/v1/organ-donors/waitlist'),
};

// Insurance API
export const insuranceAPI = {
  getPlans: (params?: { type?: string }) => USE_MOCK_API ? mockAPI.getInsurancePlans() : api.get('/v1/insurance/plans', { params }),
  getPlanById: (id: string) => USE_MOCK_API ? mockAPI.getInsurancePlans().then(res => ({ data: res.data.find((p: any) => p.id === parseInt(id)) })) : api.get(`/v1/insurance/plans/${id}`),
  enroll: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'enrolled' } }) : api.post('/v1/insurance/enroll', data),
  getPolicies: () => USE_MOCK_API ? Promise.resolve({ data: [{ id: 1, planName: 'Basic Health', status: 'active' }] }) : api.get('/v1/insurance/policies'),
  getPolicyById: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), planName: 'Basic Health', status: 'active' } }) : api.get(`/v1/insurance/policies/${id}`),
  createClaim: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'submitted' } }) : api.post('/v1/insurance/claims', data),
  getClaims: () => USE_MOCK_API ? Promise.resolve({ data: [{ id: 1, amount: 500, status: 'approved' }] }) : api.get('/v1/insurance/claims'),
};

// Emergency API
export const emergencyAPI = {
  createAlert: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'dispatched' } }) : api.post('/v1/emergency/alerts', data),
  getAlerts: (params?: { status?: string }) => USE_MOCK_API ? Promise.resolve({ data: [{ id: 1, type: 'Medical', location: '123 Main St', status: 'active' }] }) : api.get('/v1/emergency/alerts', { params }),
  getAlertById: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), type: 'Medical', status: 'active' } }) : api.get(`/v1/emergency/alerts/${id}`),
  getAmbulances: (params?: { city?: string }) => USE_MOCK_API ? mockAPI.getEmergencyServices() : api.get('/v1/emergency/ambulances', { params }),
  getEmergencyHospitals: (params?: { city?: string }) => USE_MOCK_API ? mockAPI.getHospitals() : api.get('/v1/emergency/hospitals/emergency', { params }),
};

// AI API
export const aiAPI = {
  checkSymptoms: (data: { symptoms: string[] }) => USE_MOCK_API ? mockAPI.checkSymptoms(data.symptoms) : api.post('/v1/ai/symptom-check', data),
  checkDrugInteraction: (data: { drugs: string[] }) => USE_MOCK_API ? Promise.resolve({ data: { interactions: [], safe: true } }) : api.post('/v1/ai/drug-interaction', data),
  calculateHealthScore: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { score: 85, recommendations: ['Exercise more', 'Eat healthy'] } }) : api.post('/v1/ai/health-score', data),
  getAnalysis: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), result: 'Analysis complete' } }) : api.get(`/v1/ai/analysis/${id}`),
};

// Notification API
export const notificationAPI = {
  send: (data: any) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data, status: 'sent' } }) : api.post('/v1/notifications/send', data),
  getAll: () => USE_MOCK_API ? Promise.resolve({ data: [{ id: 1, message: 'Appointment reminder', read: false }] }) : api.get('/v1/notifications'),
  getById: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { id: parseInt(id), message: 'Appointment reminder', read: false } }) : api.get(`/v1/notifications/${id}`),
  markAsRead: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { success: true } }) : api.put(`/v1/notifications/${id}/read`),
  delete: (id: string) => USE_MOCK_API ? Promise.resolve({ data: { success: true } }) : api.delete(`/v1/notifications/${id}`),
};

// Health check
export const healthAPI = {
  check: () => USE_MOCK_API ? mockAPI.checkHealth() : api.get('/health'),
};

export default api;
