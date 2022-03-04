const authService = require('./auth.service');
const userService = require('../user/user.service');

async function login(req, res) {
  const {username, password} = req.body;
  try {
    const user = await authService.login(username, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    res.status(401).send({err: 'Failed to Login'});
  }
}

async function signup(req, res) {
  try {
    const {username, password, fullname} = req.body;
    // Never log passwords
    // logger.debug(fullname + ', ' + username + ', ' + password)
    const account = await authService.signup(username, password, fullname);
    const user = await authService.login(username, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    res.status(500).send({err: 'Failed to signup'});
  }
}

async function logout(req, res) {
  try {
    // req.session.destroy()
    req.session.user = null;
    res.send({msg: 'Logged out successfully'});
  } catch (err) {
    res.status(500).send({err: 'Failed to logout'});
  }
}

async function getUserByGoogleId(req, res) {
  try {
    const {googleId} = req.params;
    const user = await userService.getByGoogleId(googleId);
    res.json(user);
  } catch (err) {
    console.log('err:', err);
    throw err;
  }
}

module.exports = {
  login,
  signup,
  logout,
  getUserByGoogleId,
};
