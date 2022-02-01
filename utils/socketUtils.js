const db = require("../db/connection");

exports.selectChatRoom = (roomName) => {
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
};

function makeNewChatRoom(roomName) {
  const users = roomName.split("-");

  const addGoogleTag = users.map((user) => {
    if (user.length > 10) {
      user = `google-oauth2|${user}`;
    }
    return user;
  });

  const stringQr = `INSERT INTO chat_room (room_name, users_in_chat) VALUES ('${roomName}', ARRAY ['${addGoogleTag[0]}', '${addGoogleTag[1]}']) RETURNING*;`;
  return db.query(stringQr);
}

exports.patchNewMessage = (body, owner, date_time, chatName) => {
  const newMessage = {
    owner: owner,
    body: body,
    date_time: date_time,
  };

  return db
    .query(
      `UPDATE chat_room SET messages = messages || $1::jsonb WHERE room_name = $2 RETURNING *;`,
      [newMessage, chatName]
    )
    .then((result) => {
      return { messages: result.rows };
    });
};
