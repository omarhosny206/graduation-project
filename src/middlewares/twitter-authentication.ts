import IUser from "../interfaces/user-interface";
import axios from "axios";
import * as dotenv from "dotenv";

import { StatusCode } from "../enums/status-code-enum";
import * as userService from "../services/user-service";
import ApiError from "../utils/api-error";
import * as jwt from "../utils/jwt";

dotenv.config();

const TWITTER_OAUTH2_URL: string | undefined = process.env.TWITTER_OAUTH2_URL;
const TWITTER_OAUTH2_ACCESS_TOKEN: string | undefined = process.env.TWITTER_OAUTH2_ACCESS_TOKEN;
const TWITTER_CLIENT_ID: string | undefined = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET: string | undefined = process.env.TWITTER_CLIENT_SECRET;

export const authenticateByAccessToken = async (req: any, res: any, next: any): Promise<any> => {
  try {
    const { screenName } = req.body;

    if (!screenName) {
      throw ApiError.unauthorized("Unauthorized (twitter): twitter screen name not provided");
    }

    const { data: token } = await axios.post(
      TWITTER_OAUTH2_ACCESS_TOKEN!,
      {},
      {
        auth: {
          username: TWITTER_CLIENT_ID!,
          password: TWITTER_CLIENT_SECRET!,
        },
      }
    );

    const twitterAccessToken: string = token.access_token;

    const { data } = await axios.get(`${TWITTER_OAUTH2_URL}?screen_name=${screenName}`, {
      headers: { Authorization: `Bearer ${twitterAccessToken}` },
    });

    let [firstName, ...lastName] = data.name.split(" ");
    lastName = lastName.join(" ");
    const email: string = data.screen_name;

    const user: IUser | null = await userService.getByEmail(email);

    if (!user) {
      return res.status(StatusCode.Ok).json({ firstName: firstName, lastName: lastName, email: email });
    }

    const accessToken: string = await jwt.generateAccessToken(user.email);
    const refreshToken: string = await jwt.generateRefreshToken(user.email);
    return res.status(StatusCode.Ok).json({ user: user, accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    return next(error);
  }
};
