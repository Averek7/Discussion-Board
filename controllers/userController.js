const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const JWT_SECRET = process.env.JWT_SECRET;

// Signup User
exports.signup = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      mobile,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateUser = async (req, res) => {
  const { name, mobile, email } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { name, mobile, email },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await User.findByIdAndRemove(req.params.id);

    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get List of Users
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Search Users by Name
  exports.searchUsersByName = async (req, res) => {
    try {
      const users = await User.find({ name: { $regex: req.params.name, $options: 'i' } });
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Follow User
  exports.followUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (!user || !currentUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      if (currentUser.following.includes(user.id)) {
        return res.status(400).json({ msg: 'Already following' });
      }
  
      currentUser.following.push(user.id);
      user.followers.push(currentUser.id);
  
      await currentUser.save();
      await user.save();
  
      res.json({ msg: 'User followed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Unfollow User
  exports.unfollowUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (!user || !currentUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      if (!currentUser.following.includes(user.id)) {
        return res.status(400).json({ msg: 'Not following' });
      }
  
      currentUser.following = currentUser.following.filter(followId => followId.toString() !== user.id.toString());
      user.followers = user.followers.filter(followerId => followerId.toString() !== currentUser.id.toString());
  
      await currentUser.save();
      await user.save();
  
      res.json({ msg: 'User unfollowed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Get User Profile
  exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };