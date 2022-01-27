const db = require("../db/connection");
export function selectChatRoom(roomName) {
  //console.log(roomName);
  return db
    .query(`SELECT * FROM chat_room WHERE room_name = $1`, [roomName])
    .then((result) => {
      if (result.rows.length === 0) {
        return makeNewChatRoom(roomName);
      } else {
        return result;
      }
    })
    .then((result) => {
      if (!result) {
        selectChatRoom(roomName);
      } else {
        return result.rows;
      }
    });
}

function makeNewChatRoom(roomName) {
  const users = roomName.split("-");

  const stringQr = `INSERT INTO chat_room (room_name, users_in_chat) VALUES ('${roomName}', ARRAY ${[
    JSON.stringify([+users[0], +users[1]]),
  ]}) RETURNING*;`;

  return db.query(stringQr);
}

export function patchNewMessage(content, sender, date, chatName) {
  const newMessage = {
    owner: sender,
    body: content,
    date_time: date,
  };
  return db
    .query(
      `UPDATE chat_room SET messages = array_append(messages, $1) WHERE room_name = $2 RETURNING *;`,
      [newMessage, chatName]
    )
    .then((result) => {
      return result.rows;
    });
}
