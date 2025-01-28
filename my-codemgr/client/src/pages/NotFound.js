import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
