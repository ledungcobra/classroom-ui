import React from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppContext, IAppContext } from '../../App';
import { RootState } from '../reducer';
import { AppDispatch } from '../store';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppContextApi = (): IAppContext | null => {
  const Context = React.useContext(AppContext);
  return Context;
};
