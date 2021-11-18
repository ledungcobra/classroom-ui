import React from 'react';
import { clearAllToken, logout } from '../../utils/common';

import './Header.scss';

interface IHeader {}

export const Header: React.FC<IHeader> = () => {
  const handleLogout = () => {
    clearAllToken();
    logout();
  };

  return (
    <div className="header">
      <h1>HEADER</h1>
      <button type="button" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
};
