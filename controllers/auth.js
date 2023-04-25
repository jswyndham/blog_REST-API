const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/Users");
const { StatusCodes } = require("http-status-codes");

// REGISTER USER
const register = async (req, res) => {
  try {
    // create user object
    const user = await User.create({ ...req.body });

    // create token on signup
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "This email address is already in use. Please go to the login page or register with a new email address.",
    });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for name and password
    if (!email || !password) {
      throw new BadRequestError("Please provide name and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid name or password");
    }

    // compare input password to hashed password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid name or password");
    }

    // create token on login
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

// USER LOG-OUT
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      msg: "Logged out successful",
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
  }
};

module.exports = { register, login, logout };
