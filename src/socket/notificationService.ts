import { Server as SocketIOServer } from "socket.io";
import { onlineUsers } from "../socket/functions";

let io: SocketIOServer;

export const notificationService = (ioInstance: SocketIOServer) => {
  io = ioInstance;
};

export const notifyUsersAboutTeacherChange = async (
  subjectId: number,
  teacherId: number,
  subjectName: string,
  repo: any
) => {
  const activeUsers = await repo.findActiveUsers(subjectId);
  const favoriteStudents = await repo.findStudentsWithFavoriteSubject(
    subjectId
  );

  let studentIdsToNotify: any[] = [];
  activeUsers.forEach((one: any) => {
    if (!studentIdsToNotify.includes(one.userId)) {
      studentIdsToNotify.push(one.userId);
    }
  });

  favoriteStudents.forEach((one: any) => {
    if (!studentIdsToNotify.includes(one.userId)) {
      studentIdsToNotify.push(one.userId);
    }
  });

  for (const studentId of studentIdsToNotify) {
    const user = await repo.findUserById(studentId);
    const userName = user.name;

    const onlineUser = onlineUsers.find((user) => user.name === userName);

    if (onlineUser) {
      onlineUser.socket.emit("teacherChanged", {
        message: `Teacher of ${subjectName} has changed to ${teacherId}.`,
      });
    }
  }

  // Notify the teacher
  const teacher = await repo.findUserById(teacherId);
  const onlineTeacher = onlineUsers.find((user) => user.name === teacher.name);

  if (onlineTeacher) {
    onlineTeacher.socket.emit("assignedNewCourse", {
      message: `You are the new teacher of ${subjectName}.`,
    });
  }
};
