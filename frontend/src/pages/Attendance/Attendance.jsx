import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Typography, List, ListItem, ListItemText, Chip, Divider, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getUser } from '../../utils/auth';

const Attendance = () => {
  const [geoMessage, setGeoMessage] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const user = getUser();
  const [searchTerms, setSearchTerms] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      fetchAttendance();
    }
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Attendance API response:', data);
        setAttendance(data);
      } else {
        setError('Failed to fetch attendance records.');
      }
    } catch (err) {
      setError('Error fetching attendance records.');
    }
  };

  const handleMarkPresent = () => {
    setGeoMessage('');
    setGeoLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${apiUrl}/api/attendance/auto-geolocation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude })
            });
            const data = await res.json();
            if (res.ok) {
              setGeoMessage(data.message || 'Attendance marked successfully!');
            } else {
              setGeoMessage(data.message || 'Could not mark attendance.');
            }
          } catch (err) {
            setGeoMessage('Error marking attendance.');
          } finally {
            setGeoLoading(false);
          }
        },
        (err) => {
          setGeoMessage('Geolocation permission denied or unavailable.');
          setGeoLoading(false);
        }
      );
    } else {
      setGeoMessage('Geolocation is not supported by your browser.');
      setGeoLoading(false);
    }
  };

  // Group attendance records by date
  const groupedByDate = attendance.reduce((acc, record) => {
    const dateKey = record.date ? new Date(record.date).toLocaleDateString() : '-';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(record);
    return acc;
  }, {});
  const dateKeys = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  const handleSearchChange = (dateKey, value) => {
    setSearchTerms(prev => ({ ...prev, [dateKey]: value }));
  };

  if (user?.role === 'employee') {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMarkPresent}
          disabled={geoLoading}
          sx={{ mb: 2 }}
        >
          {geoLoading ? 'Marking...' : 'Mark Me as Present'}
        </Button>
        {geoMessage && (
          <Alert severity="info" sx={{ mb: 2 }}>{geoMessage}</Alert>
        )}
      </Box>
    );
  }

  // Admin/HR view
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Attendance Records
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {dateKeys.length === 0 ? (
        <Typography variant="body1">No attendance records found.</Typography>
      ) : (
        dateKeys.map(dateKey => {
          const searchTerm = searchTerms[dateKey] || '';
          const filteredRecords = groupedByDate[dateKey].filter(record => {
            const empName = record.employee?.name || '';
            return empName.toLowerCase().includes(searchTerm.toLowerCase());
          });
          return (
            <Accordion key={dateKey} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{dateKey}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Search employee by name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={searchTerm}
                  onChange={e => handleSearchChange(dateKey, e.target.value)}
                  autoComplete="off"
                />
                {filteredRecords.length === 0 ? (
                  <Typography variant="body2">No employees found for this search.</Typography>
                ) : (
                  filteredRecords.map(record => (
                    <Box key={record._id} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'background.default', boxShadow: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mr: 2 }}>{record.employee?.name || '-'}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        Dept: <b>{record.employee?.department?.name || '-'}</b>
                      </Typography>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        Check In: <b>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</b>
                      </Typography>
                      <Chip
                        label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        color={
                          record.status === 'present' ? 'success' :
                          record.status === 'late' ? 'warning' :
                          'error'
                        }
                        size="small"
                        sx={{ fontWeight: 700, ml: 1 }}
                      />
                    </Box>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
};

export default Attendance; 