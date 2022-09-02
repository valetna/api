const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'users' },
});

commentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret.hash;
  },
});

module.exports = mongoose.model("Comments", commentSchema);