import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileCard from '../components/FileCard';
import Modal from '../components/Modal';
import DarkModeToggle from '../components/DarkModeToggle';
import { AnimatePresence, motion } from 'framer-motion';

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileIcon, setNewFileIcon] = useState(null);

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

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;
    try {
      await axios.delete(`/api/files/${filename}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  const handleNewFileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('filename', newFileName);
      formData.append('content', newFileContent);
      if (newFileIcon) {
        formData.append('icon', newFileIcon);
      }

      await axios.post('/api/files', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowModal(false);
      setNewFileName('');
      setNewFileContent('');
      setNewFileIcon(null);
      fetchFiles();
    } catch (error) {
      console.error(error);
      alert('Create file failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center space-x-2">
          <DarkModeToggle />
          <button onClick={handleLogout} className="btn btn-error">
            Logout
          </button>
        </div>
      </div>

      <button onClick={() => setShowModal(true)} className="btn btn-primary mb-4">
        Add New File
      </button>

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
                onDelete={() => handleDelete(file.filename)}
                isAdmin
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleNewFileSubmit}>
          <h2 className="text-xl font-semibold mb-4">Add New File</h2>
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text">File Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              required
            />
          </div>
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Icon</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered"
              accept="image/*"
              onChange={(e) => setNewFileIcon(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Admin;
