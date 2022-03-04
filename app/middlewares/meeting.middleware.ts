import {
  validateCreateMeeting,
  validateUpdateMeeting,
} from "../validations/meeting.validation";
import { NextFunction, Request, Response } from "express";
import { IMeeting, IMeetingResponse } from "./../models/meeting.model";

class InvalidInput extends Error {
  status: number;
  constructor(message: string[]) {
    super(message.join(";"));
    this.status = 422;
  }
}

export const validateCreateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const meeting: IMeeting = req.body;

  try {
    const errors = validateCreateMeeting(meeting);
    if (errors.length > 0) {
      throw new InvalidInput(errors);
    }
    console.log("no errors in create");
    next();
  } catch (err) {
    res.status(422).send(err);
  }
};

export const validateUpdateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const meeting: IMeeting = req.body;
  try {
    const errors = validateUpdateMeeting(meeting);
    if (errors.length > 0) {
      throw new InvalidInput(errors);
    }
    console.log("no errors in update");
    next();
  } catch (err) {
    res.status(err.status).send(err);
  }
};
