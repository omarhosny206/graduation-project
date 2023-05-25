import axios from 'axios';
import qs from 'qs';
import ApiError from '../utils/api-error';

export async function generateAccessToken() {
  try {
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const { data } = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Accept: 'application/json',
        },
        auth: {
          username: PAYPAL_CLIENT_ID!,
          password: PAYPAL_SECRET!,
        },
      }
    );
    const accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    ApiError.badRequest(error);
  }
}
