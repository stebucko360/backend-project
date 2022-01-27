const db = require("../db/connection");
function selectChatRoom(roomName) {
  //console.log(roomName);
  return db
    .query(`SELECT * FROM chat_room WHERE room_name = $1`, [roomName])
    .then((result) => {
      if (result.rows.length === 0) {
        console.log(">>", roomName);
        return makeNewChatRoom(roomName);
      } else {
        console.log("else");
        return result;
      }
    })
    .then((result) => {
      if (!result) {
        selectChatRoom(roomName);
      } else {
        console.log(result.rows);
        return result.rows;
      }
    });
}

function makeNewChatRoom(roomName) {
  const users = roomName.split("-");
  console.log(users);
  const stringQr = `INSERT INTO chat_room (room_name, users_in_chat) VALUES ('${roomName}', ARRAY ${[
    JSON.stringify([+users[0], +users[1]]),
  ]}) RETURNING*;`;
  console.log(stringQr);
  return db
    .query(stringQr)

    .then((result) => {
      console.log("hi");
    });
}
selectChatRoom("1-20");
