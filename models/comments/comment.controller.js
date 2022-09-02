const express = require("express");
const router = express.Router();
const commentService = require("./comment.service");

// routes
router.post("/:_id/comment", create);
module.exports = router;


function create(req, res, next) {
  commentService
    .create(req.body,req, res)
    .catch((err) => next(err));
}
