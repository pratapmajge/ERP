import React from 'react';
import AdminDashboard from './AdminDashboard';
import HRDashboard from './HRDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import { getUser } from '../../utils/auth';

const Dashboard = () => {
  const user = getUser();
  
  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading user data...</h3>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default Dashboard; 