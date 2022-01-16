import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { HeaderSelect } from '..';
import { useAppContextApi, useAppDispatch } from '../../redux';
import { setHeaderSelect } from '../../redux/slices/classContextSlides/classContextSlides';
// import { Link } from 'react-router-dom';
import './MyClass.scss';
interface IMyClassProps {
  id?: string;
  name?: string;
  section?: string;
  ownerAvt?: string;
  ownerName?: string;
  classBackground?: any;
}

export const MyClass: React.FC<IMyClassProps> = ({
  name,
  section,
  ownerAvt,
  ownerName,
  id,
  classBackground,
}) => {
  const Context = useAppContextApi();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <li className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__img-wrapper" />
          <div className="joined__image">
            <img src={classBackground} alt="" />
          </div>
          <div className="joined__content">
            <div
              className="joined__title"
              onClick={() => {
                navigate(`/class-detail/${id}`);
                dispatch(setHeaderSelect(HeaderSelect.NewsFeed));
              }}
            >
              <h2>{name}</h2>
              <span>{section}</span>
            </div>
            <p className="joined__owner">{ownerName}</p>
          </div>
        </div>
        <Avatar className="joined__avatar" src={ownerAvt} />
      </div>
      <div className="joined__bottom">
        <PermContactCalendar />
        <FolderOpen />
      </div>
    </li>
  );
};
