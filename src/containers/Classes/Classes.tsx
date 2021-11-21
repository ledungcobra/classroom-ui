import { useEffect } from 'react';
import { batch } from 'react-redux';
import { Link } from 'react-router-dom';
import { MyClass } from '../../components/MyClass/MyClass';
import { doGetListClasses, useAppDispatch, useAppSelector } from '../../redux';
import './Classes.scss';

export const Classes = () => {
  const dispatch = useAppDispatch();
  const myClasses = useAppSelector((state) => state.classesSlice.classes);

  useEffect(() => {
    const initFetch = () => {
      batch(() => {
        dispatch(
          doGetListClasses({
            status: 'all',
          } as IParamGetListClasses),
        );
      });
    };
    initFetch();
  }, []);

  return (
    <div className="classes">
      <ol className="joined">
        {myClasses.map((item) => {
          const randAvtMin = 1;
          const randAvtMax = 7;
          const randAvatar = `./assets/avatars/${Math.floor(
            Math.random() * (randAvtMax - randAvtMin) + randAvtMin,
          )}.png`;

          return (
            <MyClass
              key={item._id}
              _id={item._id}
              name={item.name}
              ownerName={'Phạm Minh Anh Hữu'}
              ownerAvt={randAvatar}
            />
          );
        })}
      </ol>
    </div>
  );
};
