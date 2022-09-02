const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  source: { type: String, required: true },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  numberOfLikes : { type: Number, required: false, default: 0 },
  enabled: {type: Boolean, default: true},
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  format : {
    1080: { type: String, required: false },
    720: { type: String, required: false },
    480: { type: String, required: false },
    360: { type: String, required: false },
    240: { type: String, required: false },
    140: { type: String, required: false },
  }
});

videoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret.hash;
  },
});

module.exports = mongoose.model("Videos", videoSchema);