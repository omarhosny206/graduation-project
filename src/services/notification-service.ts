import axios from 'axios';

import IUser from '../interfaces/users/user-interface';
import ApiError from '../utils/api-error';

const FCM_URL = process.env.FCM_URL!!;
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY!!;

export async function notify(user: IUser, notification: any) {
  try {
    const tokens = user.info?.devicesTokens!!;

    if (tokens.length <= 0) {
      return;
    }

    const body = {
      notification: notification,
      registration_ids: tokens,
    };

    const headers = {
      Authorization: `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json',
    };

    const { data } = await axios.post(FCM_URL, body, { headers: headers });
    console.log(data);
  } catch (error) {
    console.log(error);
    throw ApiError.from(error);
  }
}
