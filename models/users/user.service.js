const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const User = db.User;
const emailCheck = require('email-check');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  authenticate,
};

async function authenticate(userAuthentification,res) {
  try {
    var user = await User.findOne({ $or: [{ username: userAuthentification.username }, { email: userAuthentification.email }] });
    if(!user){
      res.status(404).json({message: "User not find, please verify username/email!"});
    }
    const comparePassword = await bcrypt.compare(userAuthentification.password, user.password);
    if(!comparePassword){
      res.status(404).json({message: "User not find, please verify password!"});
    }
    if (comparePassword) {
      
      const token = jwt.sign({ sub: user }, config.secret, {
        expiresIn: "7d",
      });

      return {
        message: "ok",
        data: token,
      };
    
    } 

  } catch (error) {
    res.status(500).json({message: error.message});
  }


}

async function getAll(res) {
  const user = await User.find();
  const data = [];
  user.forEach(u => {
    data.push({"pseudo" : u.pseudo});
  });
  return res.status(200).json( {
    message: "ok",
    data: data,
  });
}

async function getById(id) {
  user = await User.findById(id);
  // console.log(user);
  return user;
}

async function create(userParam, req, res) {
  try {
    // validate
    if (await User.findOne({ username: userParam.username })) {
      return res.status(400).json({ message: 'Username "' + userParam.username + '" is already taken' });
    }

    if (await User.findOne({ email: userParam.email })) {
      return res.status(400).json({message : 'Email "' + userParam.email + '" is already taken'});
    }

    if (await User.findOne({ email: userParam.pseudo })) {
        return res.status(400).json({message : 'Pseudo "' + userParam.pseudo + '" is already taken'});
    }
    // tester mail
    
    if (!emailCheck(userParam.email)) {
      return res.status(400).json({message : 'Email do not exist'});
    }

    if (!isValidEmail(userParam.email) || userParam.email == '') {
      return res.status(400).json({message : 'Email is invalid'});
    }


    userParam.password = bcrypt.hashSync(userParam.password);
    // create User
    const user = new User(userParam);
    // save user
    const user_ = await user.save();

    if (user_) {
      res.status(200).send({"message": "ok","data": user_.toJSON()});    
    }   

  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}

async function update(id, userParam, res) {
    try{
        const user = await User.findById(id);
        // validate
        if (!user) return res.status(400).json({message : "User not found" });
        // hash password if it was entered
        if (userParam.password) {
        // verify new password
        if (isValidatePassword(userParam.password)) {
            userParam.hash = bcrypt.hashSync(userParam.password, 10);
        } else {
            return res.status(400).json({message :'Password is invalid, you need to have 1 Maj, 1 Min, 1 Number and 1 Caracter special'});
        }
        }
        // copy userParam properties to user
        Object.assign(user, userParam);
        const user_ = await user.save();
        if (user_) {
          res.status(200).send({"message": "ok","data": user_.toJSON()});    
        }   

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

async function _delete(id, res) {
    await User.findByIdAndRemove(id);
    res.status(200);
}

/** tools */
function isValidEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}