import express = require("express");
import { userRoute } from "../User/router/userRouter";
import { roomRoute } from "../Room/router/roomRouter";
import { enrollRoute } from "../Enroll/router/enrollRouter";
import { subjectRoute } from "../Subject/router/subjectRouter";
import { teacherMarksRoute } from "../teacherMarks/router/teacherMarksRouter";
import { favoriteRoute } from "../favorites/router/faveRoute";
import { conf } from "../config/config";

export const rout = express.Router();

rout.use("/", conf);
rout.use("/user", userRoute);
rout.use("/room", roomRoute);
rout.use("/subject", subjectRoute);
rout.use("/enrollment", enrollRoute);
rout.use("/teacherMarks", teacherMarksRoute);
rout.use("/favorites", favoriteRoute);