const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const videoService = require("../videos/video.service")
// routes
router.post("/create", register);
router.post("/:_id/video", createVideo);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:_id", getById);
router.put("/:_id", update);  
router.delete("/:_id", _delete);
router.post("/auth", authenticate);
module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body, res)
    .then((user) =>
    user
      ? res.json(user)
      : res.status(400).json({ message: "Username or password is incorrect" })
  )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body,req, res)
    .catch((err) => next(err));
}
function update(req, res, next) {
  userService
    .update(req.params._id, req.body,res)
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll(res)
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params._id)
    .then((user) => (user ? res.json({
      message: "ok",
      data: user,
    }) : res.sendStatus(404).json( {
      message: "Error: User not found for the given ID!"
    })))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params._id,res)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function createVideo(req, res, next){
  videoService
    .create(req.params, res)
    .catch((err) => next(err));
}