import React from 'react';
import './HeaderFooterLayout.scss';

export const HeaderFooterLayout: React.FC<IHeaderFooterLayout> = ({ header, children, footer }) => {
  return (
    <div className="layout-full">
      <div className="layout-full__header">
        <div className="layout-full__container">{header}</div>
      </div>
      <div className="layout-full__center">{children}</div>
      <div className="layout-full__footer">
        <div className="layout-full__container">{footer}</div>
      </div>
    </div>
  );
};
