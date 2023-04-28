import * as jwt from '../utils/jwt';
import axios, { AxiosRequestConfig } from 'axios';

const GMAIL_USER = process.env.GMAIL_USER;
const ZOOM_OAUTH2_URL = process.env.ZOOM_OAUTH2_URL;

export async function create() {
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
      start_time: '2023-04-26T14:53:00', // yyyy-MM-ddTHH:mm:ss ,
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
  console.log(meeting);

  return meeting;
}
