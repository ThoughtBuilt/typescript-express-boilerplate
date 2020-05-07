import request from "supertest";
import container from "./app";
import { TestUserService } from "./services/user-service";
import { replaceSafe } from "./lib/object-utils";

replaceSafe(container, "userService", new TestUserService());

describe("GET /users", () => {
  test("Accept: text/html - Responds with HTML listing of users.", () => {
    return request(container.app)
      .get("/users")
      .accept("text/html")
      .expect("Content-Type", /html/)
      .expect(200);
  });
  test("Accept: application/json - Responds with JSON listing of users.", async () => {
    const response = await request(container.app)
      .get("/users")
      .accept("application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toMatchInlineSnapshot(`
      Object {
        "users": Array [
          Object {
            "id": 1,
            "name": "John Smith",
          },
          Object {
            "id": 2,
            "name": "Susan Doe",
          },
          Object {
            "id": 3,
            "name": "John Q Public",
          },
        ],
      }
    `);
  });
});

describe("GET /users/1", () => {
  test("Accept: application/json - Responds with JSON representation of user.", async () => {
    const response = await request(container.app)
      .get("/users/1")
      .accept("application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toMatchInlineSnapshot(`
          Object {
            "user": Object {
              "id": 1,
              "name": "John Smith",
            },
          }
        `);
  });
  test("If-None-Match: [ETag] - Responds with 304.", () => {
    return request(container.app)
      .get("/users/1")
      .set("If-None-Match", 'W/"25-I/mMK6DRuXtlN6fsUryrxzTiaXo"')
      .accept("application/json")
      .expect(304);
  });
});
