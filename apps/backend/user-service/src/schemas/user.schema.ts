import Joi from "joi";

const userJoiSchema = Joi.object({
  sub: Joi.string(),
  googleSub: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  profile: Joi.string(),
  role: Joi.string().required()
}).xor("sub", "googleSub");

export default userJoiSchema;
