import React from 'react';
import './OnlyHeaderLayout.scss';

export const OnlyHeaderLayout: React.FC<IOnlyHeaderLayout> = ({ children, header }) => {
  return (
    <div className="layout-header">
      <div className="layout-header__header">
        <div className="layout-header__container">{header}</div>
      </div>
      <div className="layout-header__center">{children}</div>
    </div>
  );
};
