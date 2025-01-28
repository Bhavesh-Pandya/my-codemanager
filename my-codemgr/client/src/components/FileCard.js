import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function FileCard({ filename, iconUrl, isAdmin, onDelete }) {
  // Real download logic
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to download files.');
        return;
      }

      // Fetch file content as a Blob
      const response = await axios.get(`/api/files/${filename}/download`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a download link for the Blob
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;

      // Save as "<filename>.txt"
      link.setAttribute('download', `${filename}.txt`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Download failed. Please try again later.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="card bg-base-100 shadow-xl animation-slideUp animation-fadeIn"
    >
      <figure className="p-4">
        <img
          src={iconUrl || '/api/uploads/default-icon.png'}
          alt={filename}
          className="w-16 h-16 object-contain"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{filename}</h2>
        <div className="card-actions flex flex-col space-y-2">
          <button
            onClick={handleDownload}
            className="btn btn-secondary hover:animate-wiggle"
          >
            Download
          </button>
          {isAdmin && (
            <button
              onClick={onDelete}
              className="btn btn-error hover:animate-wiggle"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default FileCard;
