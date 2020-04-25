import createError from "http-errors";
import type { Router } from "express";
import type { UserService } from "../services/user-service";

type Dependencies = {
  router: Router;
  userService: UserService;
};

export default (services: Dependencies) => {
  const { router } = services;
  return (
    router
      /* GET users listing. */
      .get("/", function (req, res, next) {
        const users = services.userService.listAllUsers();
        res.render("users", { users });
      })
      /* Show user page */
      .get("/:userId", function (req, res, next) {
        const userId = +req.params.userId;
        const user = services.userService.getById(userId);
        if (user) {
          res.render("user", { user });
        } else {
          next(createError(404, `User id=${userId} not found!`));
        }
      })
  );
};
