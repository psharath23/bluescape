import { IResponse } from ".";
import { ObjectId } from "mongodb";

export interface IMeetingHost {
  email: string;
  name: string;
}

export interface IMeetingSchedule {
  start: string;
  end: string;
  timeZone: string;
}

export interface IMeetingAttendee {
  email: string;
  name: string;
}

export interface IMeeting {
  _id: ObjectId;
  meetingHost: IMeetingHost;
  meetingSchedule: IMeetingSchedule;
  meetingAttendees: IMeetingAttendee[];
}

export interface IMeetingResponse extends IResponse {
  meetings?: IMeeting[];
}
