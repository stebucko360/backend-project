const request = require(`supertest`);
const app = require(`../app`);
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { expect } = require("@jest/globals");

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
  describe("Error Handling", () => {
    test(`404: given a valid user id that doesn't exist, return user is doesn't exist`, () => {
      return request(app)
        .get("/api/users/404")
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id doesn't exist" });
        });
    });
    test(`404: given a invalid user id, return invalid user_id`, () => {
      return request(app)
        .get("/api/users/batman")
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id doesn't exist" });
        });
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
  describe("Error Handling", () => {
    test(`400: if passed invalid keys, return bad request`, () => {
      return request(app)
        .post("/api/users")
        .send({
          user_id: 55,
          batman: "Pikachu",
          password: "456",
          invalid: "Pik",
          last_name: "Achu",
          email: "pika@pokemon.com",
          profile_pic:
            '"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png"',
        })
        .then((result) => {
          expect(result.body).toEqual({ msg: "Bad Request" });
        });
    });
    test(`400: if passed payload with missing keys, return bad request`, () => {
      return request(app)
        .post("/api/users")
        .send({
          user_id: 55,
          username: "Pikachu",
          password: "456",
          last_name: "Achu",
          email: "pika@pokemon.com",
          profile_pic:
            '"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png"',
        })
        .then((result) => {
          expect(result.body).toEqual({ msg: "Bad Request" });
        });
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
        postcode: "M1 7ED",
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
            postcode: "M1 7ED",
            beds: 4,
            house_images: [
              "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            ],
            offer_made: false,
            longitude: "-2.238111",
            latitude: "53.472221",
          })
        );
      });
  });
  describe("Error Handling", () => {
    test(`400: if passed invalid keys, return bad request`, () => {
      return request(app)
        .post("/api/properties")
        .send({
          user_id: "1",
          property_type: "house",
          invalid: 120000,
          postcode: "M1 7ED",
          beds: 4,
          house_images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          ],
        })
        .then((result) => {
          expect(result.body).toEqual({ msg: "Bad Request" });
        });
    });
    test(`400: if passed payload with missing keys, return bad request`, () => {
      return request(app)
        .post("/api/properties")
        .send({
          user_id: "1",
          property_type: "house",
          postcode: "M1 7ED",
          beds: 4,
          house_images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          ],
        })
        .then((result) => {
          expect(result.body).toEqual({ msg: "Bad Request" });
        });
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
  describe("Error Handling", () => {
    test('404 if passed an invalid property type, respond "property_type" doesnt not exist', () => {
      return request(app)
        .get("/api/properties?type=invalid")
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: "Invalid property_type" });
        });
    });
    test("404 if passed an invalid max_price query, return Bad request", () => {
      return request(app)
        .get("/api/properties?max_price=apple")
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "Invalid value" });
        });
    });
    test("404 if passed an invalid min_price query, return Bad request", () => {
      return request(app)
        .get("/api/properties?min_price=apple")
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "Invalid value" });
        });
    });
  });
});

describe("GET: /api/properties/:house_id", () => {
  test("200: returns a single property given an id", () => {
    return request(app)
      .get("/api/properties/1")
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual({
          house_id: 1,
          user_id: "1",
          property_type: "house",
          price: 150000,
          postcode: "WA76DD",
          latitude: "12",
          longitude: "55",
          beds: 4,
          offer_made: false,
          house_images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          ],
        });
      });
  });

  describe("Error Handling", () => {
    test(`404: given a valid house_id that doesn't exist, return house_id doesn't exist`, () => {
      return request(app)
        .get("/api/properties/404")
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: "house_id doesn't exist" });
        });
    });
    test(`404: given an invalid house_id that doesn't exist, return house_id doesn't exist`, () => {
      return request(app)
        .get("/api/properties/404")
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: "house_id doesn't exist" });
        });
    });
  });
});

describe("PATCH: /api/users/:user_id/likedhouses", () => {
  test("200: add a house_id to likedusers array returning the user with updated array", () => {

    const house = {house: {
      house_id: 2,
      user_id: 1,
      type: "house",
      price: 150000,
      postcode: "WA76DD",
      latitude: "12",
      longitude: "55",
      beds: 4,
      offer_made: false,
      house_images: [
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ]
    }}

    return request(app)
      .patch("/api/users/1/likedhouses")
      .send(house)
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
            liked_houses: expect.any(Array)
          })
        );
      });
  });
  describe("Error Handling", () => {
    test("400: when using an invalid user_id return user_id does not exist", () => {

      const house = {house: {
        house_id: 2,
        user_id: 1,
        type: "house",
        price: 150000,
        postcode: "WA76DD",
        latitude: "12",
        longitude: "55",
        beds: 4,
        offer_made: false,
        house_images: [
          "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
      }}

      return request(app)
        .patch("/api/users/404/likedhouses")
        .send(house)
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id does not exist" });
        });
    });
    test('400: when using an invalid key return "Invalid property key/value"', () => {
      return request(app)
        .patch("/api/users/1/likedhouses")
        .send({ invalid: 1 })
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "Invalid property key/value" });
        });
    });
  });
});

describe("GET: /api/users/:user_id/likedhouses", () => {
  test("200: Returns an array of properties by ID provided in users liked houses", () => {

    const house = {house: {
      house_id: 2,
      user_id: 1,
      type: "house",
      price: 150000,
      postcode: "WA76DD",
      latitude: "12",
      longitude: "55",
      beds: 4,
      offer_made: false,
      house_images: [
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ]
    }}

    return request(app)
      .patch("/api/users/1/likedhouses")
      .send(house)
      .then(() => {
        return request(app)
          .patch("/api/users/1/likedhouses")
          .send(house);
      })
      .then(() => {
        return request(app)
          .patch("/api/users/2/likedhouses")
          .send(house);
      })
      .then(() => {
        return request(app)
          .get("/api/users/1/likedhouses")
          .expect(200)
          .then((result) => {
          
            expect("properties" in result.body).toBe(true);
            expect(result.body.properties[0].liked_houses.length).toBe(2);
            expect(result.body.properties[0].liked_houses).toBeInstanceOf(Array);
          });
      });
  });
  describe("Error Handling", () => {
    test("400: when using an invalid user_id return user_id does not exist", () => {
      return request(app)
        .get("/api/users/13434343/likedhouses")
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id does not exist" });
        });
    });
    test("400: when no user_id given", () => {
      return request(app)
        .get("/api/users/notid/likedhouses")
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id does not exist" });
        });
    });
  });
});

describe("GET: /api/users/:user_id/chats ", () => {
  test("200: Returns an array of chats by ID", () => {
    return request(app)
      .get("/api/users/2/chats")
      .expect(200)
      .then((result) => {
        expect("chats" in result.body).toBe(true);
        expect(result.body.chats.length).toBe(1);
      });
  });
  describe("Error Handling", () => {
    test("400: when using an invalid user_id(not number) return invalid user_id", () => {
      return request(app)
        .get("/api/users/notValid/chats")

        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "return invalid user_id" });
        });
    });
    test("404: when using an user_id that doesn't exist return user_id does not exist", () => {
      return request(app)
        .get("/api/users/13434343/chats")
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id does not exist" });
        });
    });
  });
});

describe("PATCH: /api/settings/:user_id", () => {
  test("should patch the new address to the user's table", () => {
    const body = { settings_postcode: "M1 7ED" };

    return request(app)
      .patch("/api/settings/2")
      .send(body)
      .expect(200)
      .then((result) => {
        expect(result.body.settings).toEqual(
          expect.objectContaining({
            settings_postcode: "M1 7ED",
            settings_latitude: "53.472221",
            settings_longitude: "-2.238111",
          })
        );
      });
  });

  test("200: if passed a min price, update min_price and return updated user", () => {
    const body = { settings_min_price: 150000 };
    return request(app)
      .patch("/api/settings/2")
      .send(body)
      .expect(200)
      .then((result) => {
        expect(result.body.settings).toEqual(
          expect.objectContaining({
            settings_price_max: 300000,
            settings_price_min: 150000,
            settings_postcode: "M1 7ED",
            settings_latitude: "53.472221",
            settings_longitude: "-2.238111",
          })
        );
      });
  });
  test("200: if passed a max price, update max_price and return updated user", () => {
    const body = { settings_max_price: 500000 };
    return request(app)
      .patch("/api/settings/2")
      .send(body)
      .expect(200)
      .then((result) => {
        expect(result.body.settings).toEqual(
          expect.objectContaining({
            settings_price_max: 500000,
            settings_price_min: 0,
            settings_postcode: "M1 7ED",
            settings_latitude: "53.472221",
            settings_longitude: "-2.238111",
          })
        );
      });
  });

  test("200: if passed a house type, update settings_house_type and return updated user", () => {
    const body = { settings_house_type: "flat" };
    return request(app)
      .patch("/api/settings/2")
      .send(body)
      .expect(200)
      .then((result) => {
        expect(result.body.settings).toEqual(
          expect.objectContaining({
            settings_house_type: "flat",
          })
        );
      });
  });

  test("200: if passed a radius, update settings_radius and return updated user", () => {
    const body = { settings_radius: 8 };
    return request(app)
      .patch("/api/settings/2")
      .send(body)
      .expect(200)
      .then((result) => {
        expect(result.body.settings).toEqual(
          expect.objectContaining({
            settings_radius: 8,
          })
        );
      });
  });

  describe("Error Handling", () => {
    test("400: when using an invalid postcode return invalid address", () => {
      const body = { settings_postcode: "pess29uiZ" };

      return request(app)
        .patch("/api/settings/2")
        .send(body)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Invalid postcode");
        });
    });
    test("404: when using an user_id that doesn't exist return user_id does not exist", () => {
      const body = { settings_postcode: "M1 7ED" };

      return request(app)
        .patch("/api/settings/22")
        .send(body)
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id does not exist" });
        });
    });
  });
});

describe("DELETE: /:user_id/likedhouses", () => {
  test("When provided an array value, remove that value", () => {

    const house = {house: {
      house_id: 2,
      user_id: 1,
      type: "house",
      price: 150000,
      postcode: "WA76DD",
      latitude: "12",
      longitude: "55",
      beds: 4,
      offer_made: false,
      house_images: [
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ]
    }}

    return request(app)
      .patch("/api/users/1/likedhouses")
      .send(house)
      .then(() => {
        return request(app)
          .delete("/api/users/1/likedhouses")
          .send({ property_id: 2 })
          .expect(204)
          .then((result) => {
            return db
              .query(`SELECT liked_houses FROM users WHERE user_id = '1';`)
              .then((res) => {
                expect(res.rows[0]).toEqual({ liked_houses: [] });
              });
          });
      });
  });
  describe("Error handling", () => {
    test("400: When provided an invalid key/value return 'invalid key/value'", () => {
      return request(app)
        .patch("/api/users/1/likedhouses")
        .send({ invalid: 1 })
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "Invalid property key/value" });
        });
    });
    test("400: When provided a non existant user_id return 'user_id does not exist'", () => {

      const house = {house: {
        house_id: 2,
        user_id: 1,
        type: "house",
        price: 150000,
        postcode: "WA76DD",
        latitude: "12",
        longitude: "55",
        beds: 4,
        offer_made: false,
        house_images: [
          "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
      }}


      return request(app)
        .patch("/api/users/666/likedhouses")
        .send(house)
        .expect(400)
        .then((result) => {
          expect(result.body).toEqual({ msg: "user_id does not exist" });
        });
    });
  });
});
