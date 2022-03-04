const bcrypt = require('bcrypt');
const userService = require('../user/user.service');

async function login(username, password) {
  const user = await userService.getByUsername(username);
  if (!user) return Promise.reject('Invalid username or password');
  // TODO: un-comment for real login
  // const match = await bcrypt.compare(password, user.password)
  // if (!match) return Promise.reject('Invalid username or password')

  delete user.password;
  user._id = user._id.toString();
  return user;
}

// (async ()=>{
//     await signup('bubu', '123', 'Bubu Bi')
//     await signup('mumu', '123', 'Mumu Maha')
// })()

async function signup(username, password, fullname) {
  const saltRounds = 10;

  if (!username || !password || !fullname)
    return Promise.reject('fullname, username and password are required!');

  const userExist = await userService.getByUsername(username);
  if (userExist) return Promise.reject('Username already taken');

  const hash = await bcrypt.hash(password, saltRounds);
  return userService.add({username, password: hash, fullname});
}

module.exports = {
  signup,
  login,
};
