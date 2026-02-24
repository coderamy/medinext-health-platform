import { useState, useEffect } from 'react';
import { 
  healthAPI, 
  authAPI, 
  patientAPI, 
  providerAPI, 
  appointmentAPI, 
  hospitalAPI, 
  pharmacyAPI,
  labAPI,
  bloodBankAPI,
  organDonorAPI,
  insuranceAPI,
  emergencyAPI,
  aiAPI,
  notificationAPI
} from './services/api';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  { id: 'patients', name: 'Patient Management', description: 'Comprehensive patient records and health tracking', icon: '👤' },
  { id: 'providers', name: 'Healthcare Providers', description: 'Find and connect with doctors and specialists', icon: '⚕️' },
  { id: 'appointments', name: 'Appointments', description: 'Schedule and manage medical appointments', icon: '📅' },
  { id: 'hospitals', name: 'Hospitals', description: 'Find hospitals and medical facilities nearby', icon: '🏥' },
  { id: 'pharmacy', name: 'Pharmacy', description: 'Order medicines and get doorstep delivery', icon: '💊' },
  { id: 'labs', name: 'Diagnostic Labs', description: 'Book lab tests and view results online', icon: '🔬' },
  { id: 'bloodbank', name: 'Blood Bank', description: 'Find blood donors and manage blood supply', icon: '🩸' },
  { id: 'insurance', name: 'Insurance', description: 'Compare and purchase health insurance', icon: '📋' },
  { id: 'emergency', name: 'Emergency', description: 'Quick access to emergency services and ambulances', icon: '🚑' },
  { id: 'organdonor', name: 'Organ Donor', description: 'Register as an organ donor and save lives', icon: '❤️' },
  { id: 'ai', name: 'AI Health Assistant', description: 'Get AI-powered health insights and recommendations', icon: '🤖' },
  { id: 'notifications', name: 'Notifications', description: 'Stay updated with health reminders and alerts', icon: '🔔' },
];

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [activePage, setActivePage] = useState<string>('home');
  const [user, setUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('admin@medinext.com');
  const [loginPassword, setLoginPassword] = useState('admin123');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthAPI.check();
        setHealthStatus(response.data.status || 'online');
      } catch (error) {
        setHealthStatus('offline (mock data)');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.login({ email: loginEmail, password: loginPassword });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setActivePage('dashboard');
    } catch (error) {
      setUser({ name: 'Demo User', email: 'demo@medinext.com', role: 'patient' });
      setActivePage('dashboard');
    }
  };

  const renderLogin = () => (
    <div className="page-container">
      <div className="login-container animate-fadeIn">
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', padding: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🔐 Login to MediNext</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="form-input" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="form-input" placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>Login</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', opacity: 0.7 }}>Demo: admin@medinext.com / admin123</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="page-container">
      <div className="dashboard animate-fadeIn">
        <h2 style={{ marginBottom: '30px' }}>👋 Welcome, {user?.name || 'User'}</h2>
        <div className="grid grid-4">
          {services.slice(0, 8).map((service, index) => (
            <div key={service.id} className="card service-card" style={{ cursor: 'pointer', animationDelay: `${0.1 * index}s` }} onClick={() => setActivePage(service.id)}>
              <div className="service-icon" style={{ fontSize: '2.5rem' }}>{service.icon}</div>
              <h3>{service.name}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatients = () => {
    const [patients, setPatients] = useState<any[]>([]);
    useEffect(() => { patientAPI.getAll().then(res => setPatients(res.data)).catch(() => setPatients([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>👤 Patient Management</h2>
            <button className="btn btn-primary">+ Add Patient</button>
          </div>
          <div className="card">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {patients.map((p: any) => (<tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.email}</td><td>{p.phone}</td><td><button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '12px' }}>View</button></td></tr>))}
                {patients.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No patients - using mock data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProviders = () => {
    const [providers, setProviders] = useState<any[]>([]);
    useEffect(() => { providerAPI.getAll().then(res => setProviders(res.data)).catch(() => setProviders([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>⚕️ Healthcare Providers</h2>
          <div className="grid grid-3">
            {providers.map((p: any) => (
              <div key={p.id} className="card">
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👨‍⚕️</div>
                <h3>{p.name}</h3>
                <p style={{ color: 'var(--primary-color)' }}>{p.specialization}</p>
                <p>📍 {p.city}</p>
                <p>⭐ {p.rating} / 5</p>
                <button className="btn btn-primary" style={{ marginTop: '10px' }}>Book Appointment</button>
              </div>
            ))}
            {providers.length === 0 && <p>No providers - using mock data</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    useEffect(() => { appointmentAPI.getAll().then(res => setAppointments(res.data)).catch(() => setAppointments([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>📅 Appointments</h2>
            <button className="btn btn-primary">+ New Appointment</button>
          </div>
          <div className="card">
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Provider</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                {appointments.map((a: any) => (<tr key={a.id}><td>{a.patientName}</td><td>{a.providerName}</td><td>{a.date}</td><td>{a.time}</td><td><span className={`badge badge-${a.status === 'confirmed' ? 'success' : 'warning'}`}>{a.status}</span></td></tr>))}
                {appointments.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No appointments - using mock data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderHospitals = () => {
    const [hospitals, setHospitals] = useState<any[]>([]);
    useEffect(() => { hospitalAPI.getAll().then(res => setHospitals(res.data)).catch(() => setHospitals([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>🏥 Hospitals</h2>
          <div className="grid grid-2">
            {hospitals.map((h: any) => (
              <div key={h.id} className="card">
                <h3>{h.name}</h3>
                <p>📍 {h.city}</p>
                <p>🛏️ {h.beds} beds</p>
                <p>⭐ {h.rating} rating</p>
                <button className="btn btn-primary" style={{ marginTop: '10px' }}>View Details</button>
              </div>
            ))}
            {hospitals.length === 0 && <p>No hospitals - using mock data</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderPharmacy = () => {
    const [pharmacies, setPharmacies] = useState<any[]>([]);
    useEffect(() => { pharmacyAPI.getAll().then(res => setPharmacies(res.data)).catch(() => setPharmacies([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>💊 Pharmacy</h2>
          <div className="grid grid-2">
            {pharmacies.map((p: any) => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>📍 {p.address}</p>
                <p>📞 {p.phone}</p>
                <button className="btn btn-primary" style={{ marginTop: '10px' }}>Order Medicine</button>
              </div>
            ))}
            {pharmacies.length === 0 && <p>No pharmacies - using mock data</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderLabs = () => {
    const [labs, setLabs] = useState<any[]>([]);
    useEffect(() => { labAPI.getAll().then(res => setLabs(res.data)).catch(() => setLabs([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>🔬 Diagnostic Labs</h2>
          <div className="grid grid-2">
            {labs.map((l: any) => (
              <div key={l.id} className="card">
                <h3>{l.name}</h3>
                <p>📍 {l.city}</p>
                <p>🧪 Tests: {l.tests?.join(', ')}</p>
                <button className="btn btn-primary" style={{ marginTop: '10px' }}>Book Test</button>
              </div>
            ))}
            {labs.length === 0 && <p>No labs - using mock data</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderBloodBank = () => {
    const [inventory, setInventory] = useState<any>({});
    useEffect(() => { bloodBankAPI.getInventory().then(res => setInventory(res.data)).catch(() => setInventory({})); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>🩸 Blood Bank</h2>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3>Blood Inventory</h3>
            <div className="grid grid-4" style={{ marginTop: '20px' }}>
              {Object.entries(inventory).map(([type, units]: [string, any]) => (
                <div key={type} className="blood-type-card">
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{type}</div>
                  <div style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>{units} units</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-2">
            <button className="btn btn-primary">Donate Blood</button>
            <button className="btn btn-outline">Request Blood</button>
          </div>
        </div>
      </div>
    );
  };

  const renderInsurance = () => {
    const [plans, setPlans] = useState<any[]>([]);
    useEffect(() => { insuranceAPI.getPlans().then(res => setPlans(res.data)).catch(() => setPlans([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>📋 Insurance Plans</h2>
          <div className="grid grid-2">
            {plans.map((p: any) => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>🏢 {p.provider}</p>
                <p style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>${p.premium}/mo</p>
                <p>✅ {p.coverage} coverage</p>
                <button className="btn btn-primary" style={{ marginTop: '10px' }}>Enroll Now</button>
              </div>
            ))}
            {plans.length === 0 && <p>No plans - using mock data</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderEmergency = () => {
    const [services, setServices] = useState<any[]>([]);
    useEffect(() => { emergencyAPI.getAmbulances().then(res => setServices(res.data)).catch(() => setServices([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '10px', marginBottom: '30px', textAlign: 'center' }}>
            <h2 style={{ color: '#991b1b', marginBottom: '10px' }}>🚑 Emergency Services</h2>
            <p>In case of life-threatening emergency, call 911 immediately!</p>
          </div>
          <div className="grid grid-2">
            {services.map((s: any) => (
              <div key={s.id} className="card">
                <h3>{s.type}</h3>
                <p>📍 {s.location}</p>
                <p>Status: <span className={`badge badge-${s.status === 'available' ? 'success' : 'warning'}`}>{s.status}</span></p>
                <p>⏱️ ETA: {s.eta}</p>
                <button className="btn btn-primary" style={{ marginTop: '10px', background: '#dc2626' }}>Request Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOrganDonor = () => {
    const [donors, setDonors] = useState<any[]>([]);
    useEffect(() => { organDonorAPI.getAll().then(res => setDonors(res.data)).catch(() => setDonors([])); }, []);
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>❤️ Organ Donor Registry</h2>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3>Available Donors</h3>
            {donors.map((d: any) => (
              <div key={d.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                <strong>{d.name}</strong>
                <p>Organs: {d.organs?.join(', ')}</p>
                <span className={`badge badge-${d.status === 'available' ? 'success' : 'warning'}`}>{d.status}</span>
              </div>
            ))}
            {donors.length === 0 && <p>No donors - using mock data</p>}
          </div>
          <button className="btn btn-primary">Register as Donor</button>
        </div>
      </div>
    );
  };

  const renderAI = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const handleCheck = async () => { setLoading(true); try { const res = await aiAPI.checkSymptoms({ symptoms: symptoms.split(',').map(s => s.trim()) }); setResult(res.data); } catch (e) { alert('Error checking symptoms'); } setLoading(false); };
    return (
      <div className="page-container">
        <div className="animate-fadeIn">
          <h2 style={{ marginBottom: '30px' }}>🤖 AI Health Assistant</h2>
          <div className="card">
            <h3>Check Your Symptoms</h3>
            <div className="form-group">
              <label>Enter your symptoms (comma separated)</label>
              <textarea className="form-input" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., headache, fever, cough" rows={3} />
            </div>
            <button className="btn btn-primary" onClick={handleCheck} disabled={loading}>{loading ? 'Analyzing...' : 'Check Symptoms'}</button>
            {result && (
              <div style={{ marginTop: '30px' }}>
                <h4>Possible Conditions:</h4>
                {result.possibleConditions?.map((c: any, i: number) => (
                  <div key={i} style={{ padding: '15px', margin: '10px 0', background: c.severity === 'mild' ? '#dcfce7' : '#fef3c7', borderRadius: '8px' }}>
                    <strong>{c.condition}</strong>
                    <p>Probability: {Math.round(c.probability * 100)}%</p>
                    <span className={`badge badge-${c.severity === 'mild' ? 'success' : 'warning'}`}>{c.severity}</span>
                  </div>
                ))}
                <h4 style={{ marginTop: '20px' }}>Recommendations:</h4>
                <ul>{result.recommendations?.map((r: string, i: number) => (<li key={i} style={{ margin: '5px 0' }}>{r}</li>))}</ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="page-container">
      <div className="animate-fadeIn">
        <h2 style={{ marginBottom: '30px' }}>🔔 Notifications</h2>
        <div className="card">
          {[{ id: 1, message: 'Appointment reminder: Dr. Sarah tomorrow at 10 AM', read: false }, { id: 2, message: 'Your lab results are ready', read: true }, { id: 3, message: 'Prescription ready for pickup', read: true }].map((n: any) => (
            <div key={n.id} style={{ padding: '15px', borderBottom: '1px solid #eee', background: n.read ? 'white' : '#f0f9ff' }}>
              <p>{n.message}</p>
              <span className={`badge badge-${n.read ? 'success' : 'warning'}`}>{n.read ? 'Read' : 'New'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="animate-fadeIn">MediNext</h1>
          <p className="animate-fadeIn stagger-1">Your Complete Healthcare Platform</p>
          <div className="hero-buttons animate-fadeIn stagger-2">
            <button className="btn btn-primary" onClick={() => setActivePage('login')}>Get Started</button>
            <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Learn More</button>
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item animate-fadeIn"><h3>10M+</h3><p>Patients Served</p></div>
            <div className="stat-item animate-fadeIn stagger-1"><h3>50K+</h3><p>Healthcare Providers</p></div>
            <div className="stat-item animate-fadeIn stagger-2"><h3>500+</h3><p>Hospitals</p></div>
            <div className="stat-item animate-fadeIn stagger-3"><h3>24/7</h3><p>Support Available</p></div>
          </div>
        </div>
      </section>
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-title"><h2 className="animate-fadeIn">Our Services</h2><p className="animate-fadeIn stagger-1">Comprehensive healthcare solutions at your fingertips</p></div>
          <div className="grid grid-3">
            {services.map((service, index) => (<div key={service.id} className="service-card animate-fadeIn" style={{ animationDelay: `${0.1 * (index + 2)}s` }}><div className="service-icon">{service.icon}</div><h3>{service.name}</h3><p>{service.description}</p></div>))}
          </div>
        </div>
      </section>
      <section className="features-section">
        <div className="container">
          <div className="section-title"><h2 className="animate-fadeIn">Why Choose MediNext?</h2><p className="animate-fadeIn stagger-1">Advanced technology meets compassionate healthcare</p></div>
          <div className="grid grid-2">
            <div className="card animate-fadeIn stagger-1"><div className="feature"><div className="feature-icon">🚀</div><div><h3>AI-Powered</h3><p>Advanced AI algorithms provide personalized health insights</p></div></div></div>
            <div className="card animate-fadeIn stagger-2"><div className="feature"><div className="feature-icon">🔒</div><div><h3>Secure & Private</h3><p>Bank-grade encryption ensures your health data is protected</p></div></div></div>
            <div className="card animate-fadeIn stagger-3"><div className="feature"><div className="feature-icon">🌐</div><div><h3>Connected Care</h3><p>Seamlessly connect with doctors, hospitals, pharmacies</p></div></div></div>
            <div className="card animate-fadeIn stagger-4"><div className="feature"><div className="feature-icon">⏱️</div><div><h3>Save Time</h3><p>Book appointments, order medicines - all in one place</p></div></div></div>
          </div>
        </div>
      </section>
      <section style={{ padding: '80px 0', textAlign: 'center', background: 'var(--primary-color)' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '2.5rem' }} className="animate-fadeIn">Ready to Transform Your Healthcare?</h2>
          <button className="btn animate-fadeIn stagger-2" style={{ background: 'white', color: 'var(--primary-color)' }} onClick={() => setActivePage('login')}>Get Started Today</button>
        </div>
      </section>
    </>
  );

  const pageMap: { [key: string]: JSX.Element } = {
    'home': renderHome(),
    'login': renderLogin(),
    'dashboard': renderDashboard(),
    'patients': renderPatients(),
    'providers': renderProviders(),
    'appointments': renderAppointments(),
    'hospitals': renderHospitals(),
    'pharmacy': renderPharmacy(),
    'labs': renderLabs(),
    'bloodbank': renderBloodBank(),
    'insurance': renderInsurance(),
    'emergency': renderEmergency(),
    'organdonor': renderOrganDonor(),
    'ai': renderAI(),
    'notifications': renderNotifications(),
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActivePage('home')}><span>🏥</span> MediNext</div>
            <ul className="nav-links">
              <li><a href="#" onClick={() => setActivePage('home')}>Home</a></li>
              {user && <li><a href="#" onClick={() => setActivePage('dashboard')}>Dashboard</a></li>}
              <li><a href="#" onClick={() => setActivePage('login')}>{user ? 'Profile' : 'Login'}</a></li>
              <li>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: healthStatus.includes('online') ? '#dcfce7' : '#fef3c7', color: healthStatus.includes('online') ? '#166534' : '#92400e', fontSize: '12px', fontWeight: 500 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: healthStatus.includes('online') ? '#22c55e' : '#f59e0b', animation: 'pulse 2s infinite' }}></span>
                  {healthStatus}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 200px)' }}>{pageMap[activePage] || renderHome()}</main>
      <footer style={{ background: '#1e293b', color: 'white', padding: '40px 0', marginTop: 'auto' }}>
        <div className="container">
          <div className="grid grid-4">
            <div><h4 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>MediNext</h4><p style={{ opacity: 0.7, fontSize: '14px' }}>Your complete healthcare platform.</p></div>
            <div><h4 style={{ marginBottom: '16px' }}>Services</h4><ul style={{ listStyle: 'none', opacity: 0.7, fontSize: '14px', lineHeight: '2' }}><li>Patients</li><li>Providers</li><li>Pharmacy</li><li>Emergency</li></ul></div>
            <div><h4 style={{ marginBottom: '16px' }}>Company</h4><ul style={{ listStyle: 'none', opacity: 0.7, fontSize: '14px', lineHeight: '2' }}><li>About Us</li><li>Careers</li><li>Contact</li></ul></div>
            <div><h4 style={{ marginBottom: '16px' }}>Legal</h4><ul style={{ listStyle: 'none', opacity: 0.7, fontSize: '14px', lineHeight: '2' }}><li>Privacy Policy</li><li>Terms of Service</li><li>HIPAA</li></ul></div>
          </div>
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', opacity: 0.5, fontSize: '14px' }}>© 2024 MediNext. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
