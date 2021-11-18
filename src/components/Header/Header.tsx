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
      HEADER
      <button type="button" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
};
