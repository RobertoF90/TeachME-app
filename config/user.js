const User = require('../models/User');

const addGoogleUser =
  (User) =>
  ({ id, email, displayName, firstName, lastName, profilePhoto }) => {
    const user = new User({
      id,
      email,
      displayName,
      firstName,
      lastName,
      profilePhoto,
      source: 'google',
    });
    return user.save();
  };

const addLocalUser =
  (User) =>
  ({ username, email, password }) => {
    const user = new User({
      username,
      email,
      password,
      source: 'local',
    });
    return user.save();
  };

const getUsers = (User) => () => {
  return User.find({});
};

const getUserByEmail =
  (User) =>
  async ({ email }) => {
    return await User.findOne({ email });
  };

module.exports = (User) => {
  return {
    addLocalUser: addLocalUser(User),
    addGoogleUser: addGoogleUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
  };
};
