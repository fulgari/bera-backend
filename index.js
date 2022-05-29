const app = require("./src/express/app");
const PORT = 9001;

function init() {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

init();
