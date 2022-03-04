import "dotenv/config";
import express from "express";
import cors from "cors";
import meetingsRouter from "./app/routes/meeting.routes";
import { Db, MongoClient } from "mongodb";
import { getEnv } from "./utils";
import MeetingRouter from "./app/routes/meeting.routes";
import { authMiddleware } from "./app/middlewares/auth.middleware";
import { loggerMiddleware } from "./app/middlewares/logger.middleware";
const app = express();

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const mongoHost = getEnv("mongoHost");
const mongoPort = getEnv("mongoPort");
const mongoDBName = getEnv("mongoDBName");
const mongoConnectStr = `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`;
const port = getEnv("port");
const host = getEnv("host");
app.use(loggerMiddleware)

console.log({ mongoHost });

const startServer = async () => {
  try {
    const conn = await MongoClient.connect(mongoConnectStr);
    // Select the database by name
    const db = conn.db(mongoDBName);

    const meetingRouter = new MeetingRouter(db);
    db.stats;
    app.use("/meetings", meetingRouter.runRouter());

    app.listen(port, () => {
      console.log(`Server is running on port ${host}:${port}.`);
    });
  } catch (err) {
    console.error("error staring the server: ", err);
  }
};

startServer();
