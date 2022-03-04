import MeetingController from "./../controller/meeting.controller";
import express, { Router } from "express";
import { Db } from "mongodb";
import {
  validateCreateRequest,
  validateUpdateRequest,
} from "../middlewares/meeting.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

class MeetingRouter {
  db: Db;
  router: Router;
  controller: MeetingController;
  constructor(db: Db) {
    this.db = db;
    this.router = express.Router();
    this.controller = new MeetingController(db);
    this.router.get("/", this.controller.getAllMeetings);
    this.router.get("/:id", this.controller.getMeetingById);
    this.router.post(
      "/",
      authMiddleware,
      validateCreateRequest,
      this.controller.createMeeting
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      this.controller.deleteMeetingById
    );
    this.router.delete("/", authMiddleware, this.controller.deleteAllMeetings);
    this.router.put(
      "/:id",
      validateUpdateRequest,
      this.controller.updateMeetingById
    );
  }

  runRouter = () => {
    return this.router;
  };
}

export default MeetingRouter;
