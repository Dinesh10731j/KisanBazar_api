// payments/services/khalti.service.ts
import axios from 'axios';
import Configuration from '../../config/config';
const { Khalti_Public_Key } = Configuration;
export const verifyKhaltiPayment = async (token: string, amount: number) => {
  return axios.post(
    'https://khalti.com/api/v2/payment/verify/',
    { token, amount },
    { headers: { Authorization: Khalti_Public_Key} }
  );
};