import axios, { AxiosRequestConfig } from 'axios';

import ApiError from '../utils/api-error';
import * as jwt from '../utils/jwt';

const GMAIL_USER = process.env.GMAIL_USER;
const ZOOM_OAUTH2_URL = process.env.ZOOM_OAUTH2_URL;
const ZOOM_URL = process.env.ZOOM_URL!!;
const ZOOM_DEV_CLIENT_ID = process.env.ZOOM_DEV_CLIENT_ID!!;
const ZOOM_DEV_CLIENT_SECRET = process.env.ZOOM_DEV_CLIENT_SECRET!!;

export async function create(date: Date) {
  try {
    const basicAuth = { username: ZOOM_DEV_CLIENT_ID, password: ZOOM_DEV_CLIENT_SECRET };
    const { data } = await axios.post(ZOOM_URL, {}, {auth: basicAuth});

    const videoMeetingToken = data.access_token;

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${ZOOM_OAUTH2_URL}/${GMAIL_USER}/meetings`,
      headers: {
        Authorization: `Bearer ${videoMeetingToken}`,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json',
      },
      data: {
        start_time: date,
        timezone: 'EG',
        type: 2,
        settings: {
          join_before_host: true,
          jbh_time: 5,
          use_pmi: false,
        },
      },
    };

    const { data: meeting } = await axios.request(config);
    
    return meeting;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function create2(date: Date) {
  try {
    const videoMeetingToken = await jwt.generateVideoMeetingToken();

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${ZOOM_OAUTH2_URL}/${GMAIL_USER}/meetings`,
      headers: {
        Authorization: `Bearer ${videoMeetingToken}`,
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json',
      },
      data: {
        start_time: date,
        timezone: 'EG',
        type: 2,
        settings: {
          join_before_host: true,
          jbh_time: 5,
          use_pmi: false,
        },
      },
    };

    const { data: meeting } = await axios.request(config);
    return meeting;
  } catch (error) {
    throw ApiError.from(error);
  }
}
