import React from 'react';
import './OnlyFooterLayout.scss';

export const OnlyFooterLayout: React.FC<IOnlyFooterLayout> = ({ children, footer }) => {
  return (
    <div className="layout-footer">
      <div className="layout-footer">{children}</div>
      <div className="layout-footer__footer">
        <div className="layout-footer">{footer}</div>
      </div>
    </div>
  );
};
