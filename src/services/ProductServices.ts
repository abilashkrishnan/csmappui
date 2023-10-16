import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'

export const createProduct = async (values:any) => {
    // if(formData?.environment)
    // {
    //     setAuthToken(formData?.environment)
    // }
    try {
        const res = await trackPromise(axios.post(`http://localhost:3000/product/create`,values));
        return res.data;
      } catch (error:any) {
        // console.log(error.response);
        return error.response;
      }
}