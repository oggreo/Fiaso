import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.exchangerate.host/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  getRate(fromCurrency, toCurrency) {
    return apiClient.get(`/convert?from=${fromCurrency}&to=${toCurrency}`);
  },
};
