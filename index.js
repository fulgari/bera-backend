const app = require('./src/express/app');
const PORT = process.env.PORT || 9001;

function init () {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

init();
