import { useEffect } from 'react';
import { batch } from 'react-redux';
import { MyClass } from '../../components/MyClass/MyClass';
import { doGetListClasses, useAppContextApi, useAppDispatch, useAppSelector } from '../../redux';
import './Classes.scss';

export const Classes = () => {
  const dispatch = useAppDispatch();
  const myClasses = useAppSelector((state) => state.classesSlice.classes);
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const Context = useAppContextApi();

  useEffect(() => {
    Context?.showLoading();
    Context?.setRoleTeacher(0);
    Context?.setCurrentClassId(null);
    const initFetch = () => {
      batch(() => {
        dispatch(
          doGetListClasses({
            currentUser,
            title: '',
            sortColumn: '',
            startAt: 0,
            maxResults: 10,
          } as IParamGetListClasses),
        ).then(() => {
          Context?.hideLoading();
        });
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
              key={item.id}
              id={item.id}
              name={item.title}
              ownerName={item.owner}
              ownerAvt={randAvatar}
              classBackground={item.classBackground}
            />
          );
        })}
      </ol>
    </div>
  );
};
