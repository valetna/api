const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const Video = db.Video;
const User = db.User;
/*const emailCheck = require('email-check');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');*/


module.exports = {
  create,
};


async function create(commentParam, req, res) {
  try {
    // connect to the videos database

    // Create GridFS bucket to upload a large file
    const bucket = new mongodb.GridFSBucket(Video);

    // create upload stream using GridFS bucket
    const videoUploadStream = bucket.openUploadStream('bigbuck');

    // You can put your file instead of bigbuck.mp4
    const videoReadStream = fs.createReadStream('./bigbuck.mp4');

    // Finally Upload!
    videoReadStream.pipe(videoUploadStream);

    // All done!
    res.status(200).send("Done...");

  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}
