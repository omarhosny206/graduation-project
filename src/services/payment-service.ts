import axios from 'axios';
import qs from 'qs';
import ApiError from '../utils/api-error';

const baseURL = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  production: 'https://api-m.paypal.com',
};

export async function generateAccessToken() {
  try {
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const url = `${baseURL.sandbox}/v1/oauth2/token`;
    const body = qs.stringify({ grant_type: 'client_credentials' });
    const headers = { Accept: 'application/json' };
    const auth = { username: PAYPAL_CLIENT_ID!, password: PAYPAL_SECRET! };

    const { data } = await axios.post(url, body, { headers: headers, auth: auth });
    const accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    ApiError.badRequest(error);
  }
}
