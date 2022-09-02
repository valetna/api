const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const Comment = db.Comment;
const User = db.User;
const emailCheck = require('email-check');

module.exports = {
  create,
};


async function getById(id) {
  user = await User.findById(id);
  // console.log(user);
  return user;
}

async function create(commentParam, req, res) {
  try {

    const user = await User.findById(req.params._id);
    if(user){
        data = {"body" : commentParam.body, "user" : user._id};
        // create comment
        const comment = new Comment(data);
        // save comment
        const comment_ = await comment.save();

        /*const updated_comment = await Comment.findById(comment_.id).populate('user');

        console.log(updated_comment.toJSON())*/

        if (comment_) {
            res.status(200).send({"message": "ok","data": {"id" : comment_._id, "body" : comment_.body , "user" : user}});    
        }   
    }
    return res.status(500).json({message: "User not found with the given id!"})

  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}
