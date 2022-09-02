const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  pseudo: { type: String, unique: true, required: true },
  email :{ type: String, unique: true, required:true},
  password : {type: String, required: true},
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.hash;
  },
});

module.exports = mongoose.model("User", schema);