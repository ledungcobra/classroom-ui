import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

export const Home = () => {
  return (
    <div className="home">
      <h1>HOME</h1>
      <Link to="/classes" style={{ padding: 5 }}>
        View classes
      </Link>
    </div>
  );
};
