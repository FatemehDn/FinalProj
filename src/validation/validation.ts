import Joi from "joi";
import { IUser } from "../User/model/IUser";
import { userRepo } from "../User/repository/userRepo";

export const validateUserData = (user: IUser) => {
  // console.log(repo.coppyUserList());

  const userSchema = Joi.object<IUser>({
    name: Joi.string().min(2).required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().min(3).required(),
  });
  return userSchema.validate(user);
};
export const validateUpdateUserData = (user: IUser) => {
  const userSchema = Joi.object<IUser>({
    id: Joi.number().required(),
    name: Joi.string().min(2).required(),
    password: Joi.string().min(4).required(),
  });
  return userSchema.validate(user);
};
export const listIsEmpth = (repo: userRepo) => {
  const listSchema = Joi.array().min(1);
  return listSchema.validate(repo);
};

export const isPositiveInt = (num: any) => {
  const positiveIntSchema = Joi.number().positive();
  return positiveIntSchema.validate(num);
};

export const validateLogin = (user: any) => {
  const loginSchema = Joi.object({
    name: Joi.string().min(2).required(),
    password: Joi.string().min(4).required(),
  });
  return loginSchema.validate(user);
};

export const validateEnrollmentInput = (enroll: any) => {
  const loginSchema = Joi.object({
    subjectId: Joi.number().required(),
  });
  return loginSchema.validate(enroll);
};

export const validateSubjectInput = (enroll: any) => {
  const loginSchema = Joi.object({
    name: Joi.string().required(),
    capacity: Joi.number().required(),
    unit: Joi.number().required(),
  });
  return loginSchema.validate(enroll);
};

export const validateRoomInput = (enroll: any) => {
  const loginSchema = Joi.object({
    name: Joi.string().required(),
    capacity: Joi.number().required(),
  });
  return loginSchema.validate(enroll);
};

export const validSetTeacherInput = (enroll: any) => {
  const loginSchema = Joi.object({
    userId: Joi.number().required(),
    subjectId: Joi.number().required(),
    role: Joi.string().required(),
  });
  return loginSchema.validate(enroll);
};

export const validSetMarkInput = (enroll: any) => {
  const loginSchema = Joi.object({
    userId: Joi.number().required(),
    subjectId: Joi.number().required(),
    mark: Joi.number().min(0).max(20).required(),
  });
  return loginSchema.validate(enroll);
};

export const validRegisterRoomInput = (enroll: any) => {
  const loginSchema = Joi.object({
    subjectId: Joi.number().required(),
    roomId: Joi.number().required(),
  });
  return loginSchema.validate(enroll);
};

export const validTeacherMark = (enroll: any) => {
  const loginSchema = Joi.object({
    enrollmentId: Joi.number().required(),
    mark: Joi.number().required(),
  });
  return loginSchema.validate(enroll);
};
