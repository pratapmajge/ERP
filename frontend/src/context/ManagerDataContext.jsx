import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ManagerDataContext = createContext();

export const useManagerData = () => {
  return useContext(ManagerDataContext);
};

export const ManagerDataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesData, progressData] = await Promise.all([
          api.get('/employees/assigned'),
          api.get('/progress')
        ]);
        setEmployees(employeesData);
        setProgress(progressData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch manager data:", err);
        setError('Failed to load critical data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    employees,
    progress,
    loading,
    error
  };

  return (
    <ManagerDataContext.Provider value={value}>
      {children}
    </ManagerDataContext.Provider>
  );
}; 