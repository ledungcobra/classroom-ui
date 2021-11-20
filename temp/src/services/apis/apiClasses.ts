import axiosMain from '../axios/axiosMain';
import { objToQuery } from '../../utils';

const basicUrl = 'classes/';
const basicUrlWithoutSlash = 'classes';

export const apiClasses = {
  getListClasses: (params: IParamGetListClasses) => {
    const url = basicUrlWithoutSlash + '';
    return axiosMain.get(url + objToQuery(params));
  },
};
