import axiosMain from '../axios/axiosMain';
import { objToQuery } from '../../utils';

//const basicUrl = 'classes/';
const basicUrlWithoutSlash = 'course';

export const apiClasses = {
  getListClasses: (params: IParamGetListClasses) => {
    const url = basicUrlWithoutSlash + '';
    return axiosMain.get(url + objToQuery(params));
  },
  createNewClasses: (params: IParamCreateClasses) => {
    const url = basicUrlWithoutSlash + '';
    return axiosMain.post(url, params);
  },
};
