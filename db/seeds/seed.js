const db = require("../connection");
const pg = require("pg");
const format = require("pg-format");

const seed = (data) => {
  const { userData, propertyData, chatroomData, junctionData } = data;

  //DROP TABLES IF EXIST

  return (
    db
      .query(`DROP TABLE IF EXISTS properties;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS chatroom_junction;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS chat_room;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        //CREATE TABLES

        return db.query(`
        CREATE TABLE users(
            user_id VARCHAR(100) PRIMARY KEY NOT NULL,
            username VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            profile_pic VARCHAR(150) NOT NULL,
            liked_houses INT ARRAY DEFAULT array[]::INT[],
            settings_postcode VARCHAR(7) DEFAULT 'M17ED',
            settings_latitude DECIMAL DEFAULT '53.32500',
            settings_longitude DECIMAL DEFAULT '-2.66400',
            settings_radius INT DEFAULT '5',
            settings_price_min INT DEFAULT '0',
            settings_price_max INT DEFAULT '300000',
            settings_house_type VARCHAR(50) DEFAULT 'house'
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE properties(
            house_id SERIAL PRIMARY KEY,
            user_id VARCHAR(100) REFERENCES users (user_id) NOT NULL,
            property_type VARCHAR(100) NOT NULL,
            price INT NOT NULL,
            postcode VARCHAR(7) NOT NULL,
            latitude DECIMAL DEFAULT '53.32500',
            longitude DECIMAL DEFAULT '-2.66400',
            beds INT NOT NULL,
            offer_made BOOLEAN DEFAULT 'false',
            house_images TEXT[6] DEFAULT array[]::TEXT[]
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE chat_room(
            room_name VARCHAR PRIMARY KEY,
            users_in_chat text[] DEFAULT array[]::text[],
            messages JSONB DEFAULT '{}'::jsonb
        );`);
      })
      // .then(() => {
      //   return db.query(`
      //     CREATE TABLE chatroom_junction(
      //         junction_id SERIAL PRIMARY KEY,
      //         user_id VARCHAR(100) REFERENCES users (user_id) NOT NULL,
      //         chat_room_id INT REFERENCES chat_room (chat_room_id) NOT NULL
      //     );`);
      // })
      .then(() => {
        //POPULATE TABLES

        const queryString = format(
          `
        INSERT INTO users
        (user_id, username, password, first_name, last_name, email, profile_pic)
        VALUES
        %L;`,
          userData.map((item) => [
            item.user_id,
            item.username,
            item.password,
            item.firstname,
            item.secondname,
            item.email,
            item.profilepic,
          ])
        );

        return db.query(queryString);
      })
      .then(() => {
        const queryString = format(
          `
        INSERT INTO properties
        (user_id, property_type, price, postcode, latitude, longitude, beds, offer_made, house_images)
        VALUES
        %L;`,
          propertyData.map((item) => [
            item.user_id,
            item.type,
            item.price,
            item.postcode,
            item.latitude,
            item.longitude,
            item.beds,
            item.offer_made,
            `{${item.house_images}}`,
          ])
        );

        return db.query(queryString);
      })
      .then(() => {
        const queryString = format(
          `
        INSERT INTO chat_room
        (room_name, users_in_chat, messages)
        VALUES
        %L;`,
          chatroomData.map((item) => [
            item.room_name,
            `{${item.users_in_chat}}`,
            JSON.stringify(item.messages),
          ])
        );

        return db.query(queryString);
      })
  );
  // .then(() => {
  //   const queryString = format(
  //     `
  //     INSERT INTO chatroom_junction(
  //         user_id, chat_room_id
  //     )
  //     VALUES
  //     %L;`,
  //     junctionData.map((item) => [item.user_id, item.chat_room_id])
  //   );

  //   return db.query(queryString);
  // });
};

module.exports = seed;
