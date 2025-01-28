import React from 'react';
import { themeChange } from 'theme-change'; // Provided by daisyUI
import { useEffect } from 'react';

function DarkModeToggle() {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <label className="swap swap-rotate">
      <input type="checkbox" />
      {/* sun icon */}
      <svg
        className="swap-on fill-current w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64 17.36A9 9 0 1117.36 5.64 9 9 0 015.64 17.36z"></path>
      </svg>
      {/* moon icon */}
      <svg
        className="swap-off fill-current w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
      </svg>
    </label>
  );
}

export default DarkModeToggle;
