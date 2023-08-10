const app = require("./src/express/app");
const authApp = require("./src/auth/server");
const PORT = process.env.PORT || 9001;
const AUTH_PORT = process.env.AUTH_PORT || 9002;

function init() {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  authApp.listen(AUTH_PORT, ()=> {
    console.log(`Auth server is listening on port ${AUTH_PORT}`);
  });
}

init();
