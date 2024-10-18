const axios = require("axios");
const io = require("socket.io-client");

const SERVER_URL = "http://localhost:3000";
async function login(name, password) {
  try {
    const response = await axios.post(`${SERVER_URL}/user/login`, {
      name,
      password,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

async function changeTeacher(userId, subjectId, role, token) {
  try {
    const response = await axios.put(
      `${SERVER_URL}/user/setTeacher`,
      { userId, subjectId, role },
      { headers: { authorization: `${token}` } }
    );
    // console.log(response);
    console.log("Teacher change response:", response.data);
  } catch (error) {
    console.error("Teacher Change Error:", error.response ? error.response.data : error.message);
  }
}

function connectSocket(token, userName) {
  const socket = io(SERVER_URL, {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log(userName + " Connected to WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log(userName + " Disconnected from WebSocket server");
  });
}

(async function () {
  try {
    const user1 = "ali";
    const user2 = "hasan";
    const user3 = "mamad";
    const token1 = await login(user1, "a1234");
    const token2 = await login(user2, "h1234");
    const token3 = await login(user3, "m1234");

    connectSocket(token1, user1);
    connectSocket(token2, user2);
    connectSocket(token3, user3);

    await changeTeacher(2, 2, "teacher", token1); 
   } catch (error) {
    console.error("Client Flow Error:", error);
  }
})();
