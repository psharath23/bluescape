import { IMeeting } from "../models/meeting.model";
import { validate as validateEmail } from "email-validator";
import moment from "moment";
const datetimeFormat = "YYYY-MM-DDTHH:mm:SS.ssssss";
const isObjectType = (v: any) => typeof v === "object";
const isStringType = (v: any) => typeof v === "string";
const isValidDateTime = (v: any) => moment(v, datetimeFormat).isValid();
const isValidArray = (v: any) => Array.isArray(v);

export const validateCreateMeeting = (meeting: IMeeting): string[] => {
  const errors: string[] = [];
  const { meetingHost, meetingSchedule, meetingAttendees } = meeting;
  if (!meetingHost || (meetingHost && !isObjectType(meetingHost))) {
    errors.push("meetingHost is required in meetingHost and must be an object");
  } else {
    const { name, email } = meetingHost;
    if (!name || (name && !isStringType(name))) {
      errors.push("name is required in meetingHost and must be a string");
    }

    if (!email || (email && !validateEmail(email))) {
      errors.push("email is required in meetingHost and must be a valid email");
    }
  }

  if (!meetingSchedule || (meetingSchedule && !isObjectType(meetingSchedule))) {
    errors.push("meetingSchedule is required in meeting and must be an object");
  } else {
    const { start, end } = meetingSchedule;
    if (!start || (start && !isValidDateTime(start))) {
      errors.push(
        `start in meetingSchedule is required and must be of format ${datetimeFormat}`
      );
    }

    if (!end || (end && !isValidDateTime(end))) {
      errors.push(
        `end in meetingSchedule is required and must be of format ${datetimeFormat}`
      );
    }
  }

  if (
    !meetingAttendees ||
    (meetingAttendees && !isValidArray(meetingAttendees))
  ) {
    errors.push(
      "meetingAttendees is required in meeting and must be a list of email and name objects"
    );
  } else {
    const attendeeEmailErrors = meetingAttendees
      .map((a, i) =>
        validateEmail(a.email) ? "" : `attendee ${i + 1} has invalid email`
      )
      .filter((a) => a);
    if (attendeeEmailErrors.length > 0) {
      errors.push(attendeeEmailErrors.join("\n"));
    }
  }

  return errors;
};

export const validateUpdateMeeting = (meeting: IMeeting) => {
  const errors = validateCreateMeeting(meeting);
  const { _id } = meeting;
  if (!_id) {
    errors.push("_id is required for updating the meeting");
  }

  return errors;
};
