import type { Router } from "express";
import type { UserService, User } from "../services/user-service";

export default ({
  router,
  userService,
}: {
  router: Router;
  userService: UserService;
}) => {
  return (
    router
      /* GET users listing. */
      .get("/", function (req, res, next) {
        res.send(
          "<ol>" +
            userService
              .listAllUsers()
              .map((user: User) => {
                return `<li><a href="/users/${user.id}">${user.name}</a></li>`;
              })
              .join("") +
            "</ol>"
        );
      })
      /* Show user page */
      .get("/:userId", function (req, res, next) {
        const userId = +req.params.userId;
        const user = userService.getById(userId);
        if (user) {
          res.send(`Welcome, ${user.name}!`);
        } else {
          res.status(404).send(`User id=${userId} not found!`);
        }
      })
  );
};
