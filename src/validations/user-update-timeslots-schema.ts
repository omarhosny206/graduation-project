import Joi from 'joi';

import ITimeslot from '../interfaces/users/timeslot-interface';
import IUserInfo from '../interfaces/users/user-info-interface';

const userUpdateTimeslotsSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  timeslots: Joi.array()
    .items(
      Joi.object<ITimeslot>({
        day: Joi.number().valid(0, 1, 2, 3, 4, 5, 6).required(),
        hours: Joi.array()
          .items(
            Joi.string()
              .regex(/^(0[0-9]|1[0-9]|2[0-3]):00|30$/)
              .required()
          )
          .unique()
          .required(),
      })
    )
    .min(7)
    .max(7)
    .unique('day')
    .required(),
});

export default userUpdateTimeslotsSchema;
