import Joi from 'joi';

import IUserInfo from '../interfaces/users/user-info-interface';

const userUpdatePriceSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  price: Joi.number().min(5).required(),
});

export default userUpdatePriceSchema;
