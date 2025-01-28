import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileCard from '../components/FileCard';
import DarkModeToggle from '../components/DarkModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

function User() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get('/api/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">User Panel</h1>
        <div className="flex items-center space-x-2">
          <DarkModeToggle />
          <button onClick={handleLogout} className="btn btn-error">
            Logout
          </button>
        </div>
      </div>

      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <FileCard
                filename={file.filename}
                iconUrl={file.icon_url}
                isAdmin={false}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default User;
