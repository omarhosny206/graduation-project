import axios from 'axios';

import qs from 'qs';

import ApiError from '../utils/api-error';
import { AuthenticatedUser } from '../utils/authenticated-user-type';
import * as userService from './user-service';
import IInterview from '../interfaces/interviews/interview-interface';
import { ObjectId } from 'mongoose';

const baseURL = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  production: 'https://api-m.paypal.com',
};

async function generateAccessToken() {
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

export async function onboardUser() {
  try {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/customer/partner-referrals`;
    const body = {
      operations: [
        {
          operation: 'API_INTEGRATION',
          api_integration_preference: {
            rest_api_integration: {
              integration_method: 'PAYPAL',
              integration_type: 'THIRD_PARTY',
              third_party_details: {
                features: ['PAYMENT', 'REFUND'],
              },
            },
          },
        },
      ],
      products: ['EXPRESS_CHECKOUT'],
      legal_consents: [
        {
          type: 'SHARE_DATA_CONSENT',
          granted: true,
        },
      ],
      partner_config_override: {
        partner_logo_url: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
        return_url: 'http://localhost:8080/api/v1/payment/onboard/finish', // needs to be changed
        return_url_description: 'the url to return the merchant after the paypal onboarding process.',
        show_add_credit_card: true,
      },
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const { data } = await axios.post(url, body, { headers: headers });
    return data;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function finishOnboarding(user: AuthenticatedUser, merchantId: string) {
  try {
    const updatedUser = await userService.saveMerchantId(user, merchantId);
    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function createOrder(interview: IInterview) {
  try {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders`;

    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: interview.price.toFixed(2).toString(),
            breakdown:{
              item_total: {
                currency_code: 'USD',
                value: interview.price.toFixed(2).toString(),
              }
            }
          },
          items: [
            {
              name: `Interview on ${interview.date.getDay() + 1}/${interview.date.getMonth() + 1}/${interview.date.getFullYear()} ${interview.date.getHours() + 1}:${interview.date.getMinutes().toFixed(2)}`,
              quantity: '1',
              unit_amount: {
                currency_code: 'USD',
                value: interview.price.toFixed(2).toString(),
              }
            },
          ],
          payment_instruction: {
            disbursement_mode: 'INSTANT',
            platform_fees: [
              {
                amount: {
                  currency_code: 'USD',
                  value: (interview.price * 0.05).toFixed(2).toString(),
                },
              },
            ],
          },
        },
      ],
    };
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
    const { data } = await axios.post(url, body, { headers: headers });
    return data;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function capturePayment(orderId: string) {
  try {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
    const { data } = await axios.post(url, {}, { headers: headers });
    return data;
  } catch (error) {
    throw ApiError.from(error);
  }
}
