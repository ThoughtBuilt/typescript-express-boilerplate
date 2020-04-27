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
      .get("/", async function (req, res, next) {
        const users = await services.userService.listAllUsers();
        res.render("users", { users });
      })
      /* Show user page */
      .get("/:userId", async function (req, res, next) {
        const userId = +req.params.userId;
        const user = await services.userService.getById(userId);
        if (user) {
          res.render("user", { user });
        } else {
          next(createError(404, `User id=${userId} not found!`));
        }
      })
  );
};
