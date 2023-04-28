import axios from 'axios';

import ApiError from '../utils/api-error';

const FCM_URL = process.env.FCM_URL!!;
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY!!;

export async function notify() {
  try {
    const token =
      'e7Dw8bX7-urxYfsydrd2PG:APA91bEvG10LV1IL22VigTcUmbpNWF8Bx55ORrNKCExg12xRQlnOj-nVDNr_6Klu1gR6RhSBHR34hdsLK_UgKrbc43AtqT1A8_S0xtZatbFKuBlblWygtSAAtOBbPW7o2d6Z0VP6xp-Y';
    const tokens: string[] = [token];

    const notification = {
      title: 'Pass Interviews Notification',
      text: 'Someone has booked an interview with you, confirm it now',
    };

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
    return data;
  } catch (error) {
    console.log(error);
    throw ApiError.from(error);
  }
}
