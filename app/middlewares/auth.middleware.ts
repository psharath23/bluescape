import { IResponse } from "./../models/index";
import { NextFunction, Request, response, Response } from "express";

class AccessForbidden extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = 403;
    this.name = "AccessForbidden";
    this.message = message;
  }
}

class AccessNotAuthorized extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = 401;
    this.message = message;
    this.name = "AccessNotAuthorized";
  }
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization = req.get("Authorization");
    if (!Authorization) {
      throw new AccessNotAuthorized("Authorization header is missing");
    } else if (typeof Authorization !== "string") {
      throw new AccessNotAuthorized("Authorization header must be a string");
    } else if (
      !Authorization.includes("Bearer") &&
      !Authorization.includes("bearer")
    ) {
      throw new AccessNotAuthorized(
        "Authorization header must include Bearer/bearer"
      );
    } else if (
      !(Authorization.replace("Bearer ", "").length > 0) &&
      !(Authorization.replace("bearer ", "").length > 0)
    ) {
      throw new AccessNotAuthorized(
        "Authorization header is empty after Bearer/bearer"
      );
    } else {
      // implement the logic to validate the toke
      // extract the user details
      // add the user details to the request
      // adding the user details to the request would help in further business logic
      next();
    }
  } catch (err) {
    res.status(err.status).send({
      message: err.message,
      name: err.name,
    });
  }
};
