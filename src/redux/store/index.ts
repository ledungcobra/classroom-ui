import { configureStore } from '@reduxjs/toolkit';
import { ETokenKey } from '../../constants';
import rootReducer from '../reducer';
function saveToLocalStorage(store: any) {
  try {
    const toSaveObject = {
      ...store,
      editorReducer: {
        ...store.editorReducer,
        exerciseName: undefined,
        maxGrade: undefined,
      },
    };
    delete toSaveObject.gradeReviewReducer;

    const serializedStore = JSON.stringify(toSaveObject);
    window.localStorage.setItem(ETokenKey.STORE, serializedStore);
  } catch (e) {
    console.log(e);
  }
}
function loadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem(ETokenKey.STORE);
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});
store.subscribe(() => saveToLocalStorage(store.getState()));
export type AppDispatch = typeof store.dispatch;
