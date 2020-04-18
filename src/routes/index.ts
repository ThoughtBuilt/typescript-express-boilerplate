import express from "express";

export default ({ router = express.Router() } = {}) => {
  /* GET home page. */
  return router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
  });
};
