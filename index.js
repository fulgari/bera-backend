const { app, wss } = require('./src/express/app');
const PORT = process.env.PORT || 9001;

function init () {
  const httpServer = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  httpServer.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req)
    })
  })
}

init();
