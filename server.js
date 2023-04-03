// require packages
const http = require("http");

const app = require("./app");

const CONFIG = require("./config/config");

const PORT = CONFIG.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
