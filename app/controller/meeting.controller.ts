import { Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import { IMeetingResponse, IMeeting } from "../models/meeting.model";

const writeResponse = (
  res: Response,
  status: number,
  meetingResponse: IMeetingResponse
) => {
  res.status(status).send({ ...meetingResponse });
};

class MeetingDoesNotExist extends Error {
  status: number;
  constructor() {
    super("meeting does not exist");
    this.status = 422;
    this.name = "MeetingDoesNotExist";
  }
}

export default class MeetingsController {
  db: Db;
  constructor(db: Db) {
    this.db = db;
  }
  getAllMeetings = async (req: Request, res: Response) => {
    const { hostname } = req.query;

    const meetingResponse: IMeetingResponse = {
      meetings: [],
    };

    try {
      const result = await this.db
        .collection("meeting")
        .find(hostname && { hostname: { $eq: hostname } });
      const meetings = await result.toArray();
      writeResponse(res, 200, {
        ...meetingResponse,
        meetings: meetings as IMeeting[],
      });
    } catch (err) {
      writeResponse(res, 500, {
        ...meetingResponse,
        message: err.message,
      });
    }
  };

  getMeetingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
    }
    const meetingResponse: IMeetingResponse = {
      meetings: [],
    };
    try {
      const result = await this.db.collection("meeting").find(new ObjectId(id));

      const meetings = await result.toArray();

      if (meetings.length === 0) {
        throw new MeetingDoesNotExist();
      }

      writeResponse(res, 200, {
        ...meetingResponse,
        meetings: meetings as IMeeting[],
        message: "success",
      });
    } catch (err) {
      writeResponse(res, 422, {
        ...meetingResponse,
        message: err.message,
      });
    }
  };

  createMeeting = async (req: Request, res: Response) => {
    console.log("create meeting");
    const meetingResponse: IMeetingResponse = {
      meetings: [],
    };
    const meeting: IMeeting = req.body;

    try {
      const result = await this.db.collection("meeting").insertOne(meeting);
      writeResponse(res, 200, {
        ...meetingResponse,
        meetings: [{ ...meeting, _id: result.insertedId }],
      });
    } catch (err) {
      writeResponse(res, 500, {
        ...meetingResponse,
        message: err.message,
      });
    }
  };

  deleteMeetingById = async (req: Request, res: Response) => {
    const meetingResponse: IMeetingResponse = {
      meetings: [],
    };
    const { id } = req.params;
    try {
      const result = await this.db
        .collection("meeting")
        .deleteOne({ _id: new ObjectId(id) });
      writeResponse(res, 200, {
        ...meetingResponse,
        message: `deleted ${result.deletedCount}`,
      });
    } catch (err) {
      writeResponse(res, 500, {
        ...meetingResponse,
        message: err.message,
      });
    }
  };

  deleteAllMeetings = async (req: Request, res: Response) => {
    const meetingResponse: IMeetingResponse = {
      meetings: [],
    };
    try {
      const result = await this.db.collection("meeting").deleteMany({});
      writeResponse(res, 200, {
        ...meetingResponse,
        message: `deleted ${result.deletedCount}`,
      });
    } catch (err) {
      writeResponse(res, 500, {
        ...meetingResponse,
        message: err.message,
      });
    }
  };

  updateMeetingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const meetingResponse: IMeetingResponse = {
      meetings: [],
    };
    const meeting: IMeeting = req.body;
    //  lets check if we have meeting object in the req
    if (!meeting) {
      writeResponse(res, 400, {
        ...meetingResponse,
        message: "missing meeting object in request body",
      });
      return;
    }

    try {
      const result = await this.db
        .collection("meeting")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: meeting },
          { upsert: false }
        );
      console.log(result);
      writeResponse(res, 200, {
        ...meetingResponse,
        meetings: [{ ...meeting, _id: new ObjectId(id) }],
      });
    } catch (err) {
      writeResponse(res, 500, {
        ...meetingResponse,
        message: err.message,
      });
    }
  };
}
