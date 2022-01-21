const db = require('../connection');
const pg = require('pg');
const format = require('pg-format');

const seed = (data) => {
    const { userData, propertyData, chatroomData } = data;

    //DROP TABLES IF EXIST
    
    return db.query(`DROP TABLE IF EXISTS properties;`)
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS chatroom_junction;`)
    })
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS chat_room;`)
        })
    .then(()=>{
        return db.query(`DROP TABLE IF EXISTS users;`)
    }).then(()=>{

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
            liked_houses INT ARRAY,
            settings_postcode VARCHAR(7) DEFAULT 'M17ED',
            settings_radius INT DEFAULT '5',
            settings_price_min INT DEFAULT '0',
            settings_price_max INT DEFAULT '300000',
            settings_house_type VARCHAR(50) DEFAULT 'house'
        );`)
    }).then(()=>{
        
        return db.query(`
        CREATE TABLE properties(
            house_id SERIAL PRIMARY KEY,
            user_id VARCHAR(100) REFERENCES users (user_id) NOT NULL,
            property_type VARCHAR(100) NOT NULL,
            price INT NOT NULL,
            postcode VARCHAR(7) NOT NULL,
            latitude INT NOT NULL,
            longitude INT NOT NULL,
            beds INT NOT NULL,
            offer_made BOOLEAN DEFAULT 'false',
            house_images VARCHAR(500)[6]
        );`)
    }).then(()=>{

        return db.query(`
        CREATE TABLE chat_room(
            chat_room_id SERIAL PRIMARY KEY,
            chatroom_name VARCHAR(100),
            messages text[]
        );`)
    }).then(()=>{

        return db.query(`
        CREATE TABLE chatroom_junction(
            junction_id SERIAL PRIMARY KEY,
            user_id VARCHAR(100) REFERENCES users (user_id) NOT NULL,
            chat_room_id INT REFERENCES chat_room (chat_room_id) NOT NULL
        );`)
    }).then(()=>{

        //POPULATE TABLES

        const queryString = format(`
        INSERT INTO users
        (user_id, username, password, first_name, last_name, email, profile_pic)
        VALUES
        %L;`, userData.map((item)=>[item.user_id, item.username, item.password, item.firstname, item.secondname, item.email, item.profilepic]))

        return db.query(queryString)
    })
}

module.exports = seed;