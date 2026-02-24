// Mock API for development - simulates backend responses
// Always returns realistic data without needing backend services

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  // Auth - Demo login always succeeds
  login: async (data: { email: string; password: string }) => {
    await mockDelay(500);
    // Accept any credentials for demo purposes
    return {
      data: {
        token: 'demo-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: data.email || 'demo@medinext.com',
          name: (data.email || 'demo').split('@')[0],
          role: 'patient'
        }
      }
    };
  },

  register: async (data: any) => {
    await mockDelay(500);
    return {
      data: {
        token: 'demo-jwt-token-' + Date.now(),
        userId: Date.now(),
        message: 'Registration successful'
      }
    };
  },

  getMe: async () => {
    await mockDelay(300);
    return {
      data: {
        id: 1,
        email: 'demo@medinext.com',
        name: 'Demo User',
        role: 'patient'
      }
    };
  },

  // Patients - Rich sample data  
  getPatients: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '+1234567890', dob: '1985-03-15' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1234567891', dob: '1990-07-22' },
        { id: 3, name: 'Michael Brown', email: 'm.brown@email.com', phone: '+1234567892', dob: '1978-11-30' },
        { id: 4, name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+1234567893', dob: '1995-01-18' }
      ]
    };
  },

  // Providers
  getProviders: async (params?: { specialization?: string; city?: string }) => {
    await mockDelay(300);
    const providers = [
      { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology', city: 'New York', rating: 4.9, experience: 15, hospital: 'MediNext Heart Center', availability: ['Mon', 'Tue', 'Wed'] },
      { id: 2, name: 'Dr. Michael Chen', specialization: 'Neurology', city: 'Los Angeles', rating: 4.8, experience: 12, hospital: 'Brain & Spine Institute', availability: ['Tue', 'Wed', 'Thu'] },
      { id: 3, name: 'Dr. Emily Williams', specialization: 'Pediatrics', city: 'Chicago', rating: 4.7, experience: 10, hospital: 'Children\'s Medical Center', availability: ['Mon', 'Wed', 'Fri'] },
      { id: 4, name: 'Dr. James Wilson', specialization: 'Orthopedics', city: 'Houston', rating: 4.6, experience: 20, hospital: 'Joint & Bone Clinic', availability: ['Mon', 'Thu'] }
    ];
    return { data: providers };
  },

  // Appointments
  getAppointments: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, patientName: 'John Smith', providerName: 'Dr. Sarah Johnson', date: '2024-01-20', time: '10:00 AM', status: 'confirmed' },
        { id: 2, patientName: 'Sarah Johnson', providerName: 'Dr. Michael Chen', date: '2024-01-21', time: '2:00 PM', status: 'pending' }
      ]
    };
  },

  createAppointment: async (data: any) => {
    await mockDelay(500);
    return {
      data: {
        id: Date.now(),
        ...data,
        status: 'confirmed'
      }
    };
  },

  // Hospitals
  getHospitals: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, name: 'MediNext General Hospital', address: '100 Medical Plaza, New York, NY 10001', phone: '+12125551000', beds: 500, rating: 4.5, specialties: ['Cardiology', 'Neurology', 'Oncology'], emergency: true },
        { id: 2, name: 'City Medical Center', address: '200 Health Blvd, Los Angeles, CA 90001', phone: '+12105552000', beds: 300, rating: 4.3, specialties: ['Emergency', 'Surgery'], emergency: true }
      ]
    };
  },

  // Pharmacy
  getPharmacies: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, name: 'MediNext Pharmacy', address: '123 Main St, New York, NY 10001', phone: '+12125551010', hours: '24/7', delivery: true },
        { id: 2, name: 'City Drug Store', address: '456 Oak Ave, Los Angeles, CA 90002', phone: '+12105552020', hours: '9AM-9PM', delivery: true }
      ]
    };
  },

  // Labs
  getLabs: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, name: 'MediNext Diagnostics', address: '789 Test Lane, Chicago, IL 60601', tests: ['Blood Test', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound'], accreditation: ['CAP', 'ISO'], hours: '7AM-7PM' },
        { id: 2, name: 'Advanced Imaging Center', address: '321 Scan Way, Houston, TX 77002', tests: ['MRI', 'CT', 'PET-Scan'], accreditation: ['JCAHO'], hours: '24/7' }
      ]
    };
  },

  // Blood Bank
  getBloodInventory: async () => {
    await mockDelay(300);
    return {
      data: {
        'A+': 50,
        'A-': 15,
        'B+': 35,
        'B-': 10,
        'AB+': 25,
        'AB-': 8,
        'O+': 75,
        'O-': 20
      }
    };
  },

  // Organ Donor
  getOrganDonors: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, name: 'Donor A', organs: ['Kidney', 'Liver'], status: 'available', bloodType: 'O+' },
        { id: 2, name: 'Donor B', organs: ['Heart', 'Lungs'], status: 'matched', bloodType: 'A+' }
      ]
    };
  },

  // Insurance
  getInsurancePlans: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, name: 'Basic Health Plan', provider: 'MediNext Insurance', premium: 150, coverage: '80%', deductible: 500, features: ['Hospitalization', 'Surgery', 'Medications'] },
        { id: 2, name: 'Premium Health Plan', provider: 'MediNext Insurance', premium: 350, coverage: '95%', deductible: 250, features: ['Hospitalization', 'Surgery', 'Medications', 'Dental', 'Vision'] }
      ]
    };
  },

  // Emergency
  getEmergencyServices: async () => {
    await mockDelay(300);
    return {
      data: [
        { id: 1, type: 'Ambulance', location: 'Downtown', status: 'available', eta: '5 min', phone: '911' },
        { id: 2, type: 'Emergency Room', location: 'Uptown', status: 'available', eta: '10 min', phone: '911' }
      ]
    };
  },

  // AI
  checkSymptoms: async (symptoms: string[]) => {
    await mockDelay(1000);
    return {
      data: {
        possibleConditions: [
          { condition: 'Common Cold', probability: 0.7, severity: 'mild', recommendation: 'Rest and fluids' },
          { condition: 'Flu', probability: 0.25, severity: 'moderate', recommendation: 'See a doctor' },
          { condition: 'Allergies', probability: 0.05, severity: 'mild', recommendation: 'Antihistamine' }
        ],
        recommendations: [
          'Rest and drink plenty of fluids',
          'Consider over-the-counter cold medication',
          'Schedule a doctor visit if symptoms worsen'
        ]
      }
    };
  },

  // Health check
  checkHealth: async () => {
    await mockDelay(200);
    return { data: { status: 'online', timestamp: new Date().toISOString() } };
  }
};
