const request = require(`supertest`);
const app = require(`../app`);
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET: /api/users/:user_id ", () => {
  test("200: should return specified user by ID", () => {
    return request(app)
      .get("/api/users/1")
      .expect(200)
      .then((result) => {
        expect(result.body.user).toEqual(
          expect.objectContaining({
            user_id: "1",
            username: "Stebucko360",
            password: "123",
            first_name: "Ste",
            last_name: "Buckley",
            email: "stesemail@email.com",
            profile_pic:
              "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png",
            settings_house_type: "house",
            settings_postcode: "M17ED",
            settings_price_max: 300000,
            settings_price_min: 0,
            settings_radius: 5,
            liked_houses: [],
          })
        );
      });
  });
});

describe("POST: /api/users", () => {
  test("201: when passed a new user, post the new user and return the new user", () => {
    return request(app)
      .post("/api/users")
      .send({
        user_id: 55,
        username: "Pikachu",
        password: "456",
        first_name: "Pik",
        last_name: "Achu",
        email: "pika@pokemon.com",
        profile_pic:
          '"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png"',
      })
      .expect(201)
      .then((result) => {
        expect(result.body.user).toBeInstanceOf(Object);
        expect(result.body.user).toEqual(
          expect.objectContaining({
            user_id: "55",
            username: "Pikachu",
            password: "456",
            first_name: "Pik",
            last_name: "Achu",
            email: "pika@pokemon.com",
            profile_pic:
              '"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png"',
            settings_house_type: "house",
            settings_postcode: "M17ED",
            settings_price_max: 300000,
            settings_price_min: 0,
            settings_radius: 5,
            liked_houses: [],
          })
        );
      });
  });
});

describe("POST: /api/properties", () => {
  test("201: when passed a new property, add to the API and return the new object", () => {
    return request(app)
      .post("/api/properties")
      .send({
        user_id: "1",
        property_type: "house",
        price: 120000,
        postcode: "WA76HY",
        beds: 4,
        house_images: [
          "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        ],
      })
      .expect(201)
      .then((result) => {
        expect(result.body.property).toBeInstanceOf(Object);
        expect(result.body.property).toEqual(
          expect.objectContaining({
            house_id: 7,
            user_id: "1",
            property_type: "house",
            price: 120000,
            postcode: "WA76HY",
            beds: 4,
            house_images: [
              "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            ],
            offer_made: false,
            longitude: "-2.66400",
            latitude: "53.32500",
          })
        );
      });
  });
});

describe("GET: /api/properties", () => {
  test("200: returns an array of all properties", () => {
    return request(app)
      .get("/api/properties")
      .expect(200)
      .then((result) => {
        expect("properties" in result.body).toBe(true);
        expect(result.body.properties.length).toBe(6);
        expect(result.body.properties).toBeInstanceOf(Array);
        result.body.properties.forEach((property) => {
          expect.objectContaining({
            user_id: expect.any(Number),
            type: expect.any(String),
            price: expect.any(Number),
            postcode: expect.any(String),
            latitude: expect.any(String),
            longitude: expect.any(String),
            beds: expect.any(Number),
            offer_made: expect.any(Boolean),
            house_images: expect.any(Array),
          });
        });
      });
  });

  test("200: returns an array of properties sorted by price 100000 - 200000", () => {
    return request(app)
      .get("/api/properties?min_price=100000&max_price=200000")
      .expect(200)
      .then((result) => {
        expect("properties" in result.body).toBe(true);
        expect(result.body.properties.length).toBe(4);
        expect(result.body.properties).toBeInstanceOf(Array);
        result.body.properties.forEach((property) => {
          expect(property.price >= 100000 && property.price <= 200000).toBe(
            true
          );
          expect.objectContaining({
            user_id: expect.any(Number),
            type: expect.any(String),
            postcode: expect.any(String),
            latitude: expect.any(String),
            longitude: expect.any(String),
            beds: expect.any(Number),
            offer_made: expect.any(Boolean),
            house_images: expect.any(Array),
          });
        });
      });
  });

  test("200: returns an array of properties with given postcode", () => {
    return request(app)
      .get("/api/properties?postcode=WA7")
      .expect(200)
      .then((result) => {
        expect("properties" in result.body).toBe(true);
        expect(result.body.properties.length).toBe(2);
        expect(result.body.properties).toBeInstanceOf(Array);
        result.body.properties.forEach((property) => {
          expect(property.postcode.substring(0, 3)).toBe("WA7");
        });
      });
  });

  test("200: returns an array of properties by type only", () => {
    return request(app)
      .get("/api/properties?type=flat")
      .expect(200)
      .then((result) => {
        expect("properties" in result.body).toBe(true);
        expect(result.body.properties.length).toBe(2);
        expect(result.body.properties).toBeInstanceOf(Array);
        result.body.properties.forEach((property) => {
          expect(property.property_type).toBe("flat");
        });
      });
  });
});

describe("PATCH: /api/users/:user_id/likedhouses", () => {
  test("200: add a house_id to likedusers array returning the user with updated array", () => {
    return request(app)
      .patch("/api/users/1/likedhouses")
      .send({ property_id: 1 })
      .expect(200)
      .then((result) => {
        expect(result.body.user).toEqual(
          expect.objectContaining({
            user_id: "1",
            username: "Stebucko360",
            password: "123",
            first_name: "Ste",
            last_name: "Buckley",
            email: "stesemail@email.com",
            profile_pic:
              "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png",
            settings_house_type: "house",
            settings_postcode: "M17ED",
            settings_price_max: 300000,
            settings_price_min: 0,
            settings_radius: 5,
            liked_houses: [1],
          })
        );
      });
  });
});

describe("GET: /api/users/:user_id/likedhouses", () => {
  test("200: Returns an array of properties by ID provided in users liked houses", () => {
    return request(app)
      .patch("/api/users/1/likedhouses")
      .send({ property_id: 1 })
      .then(() => {
        return request(app)
          .patch("/api/users/1/likedhouses")
          .send({ property_id: 2 });
      })
      .then(() => {
        return request(app)
          .patch("/api/users/2/likedhouses")
          .send({ property_id: 3 });
      })
      .then(() => {
        return request(app)
          .get("/api/users/1/likedhouses")
          .expect(200)
          .then((result) => {
            expect("properties" in result.body).toBe(true);
            expect(result.body.properties.length).toBe(2);
            expect(result.body.properties).toBeInstanceOf(Array);
          });
      });
  });
});
