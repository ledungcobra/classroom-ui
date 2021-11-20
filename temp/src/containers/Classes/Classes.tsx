import React, { useEffect } from 'react';
import { batch } from 'react-redux';
import { Link } from 'react-router-dom';
import { doGetListClasses, useAppDispatch, useAppSelector } from '../../redux';
import './Classes.scss';

export const Classes = () => {
  const dispatch = useAppDispatch();
  const classes = useAppSelector((state) => state.classesSlice.classes);

  useEffect(() => {
    batch(() => {
      dispatch(
        doGetListClasses({
          status: 'all',
        } as IParamGetListClasses),
      );
    });
  }, []);

  return (
    <div className="classes">
      {classes.map((c) => {
        return <div>{c.name}</div>;
      })}
      <Link to="/" style={{ padding: 5 }}>
        Home
      </Link>
    </div>
  );
};
