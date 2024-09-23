require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');

const config = {
  dev: process.env.NODE_ENV === 'development',
  hostname: '127.0.0.1',
  port: Number(process.env.PORT! || 3045),
};

const app = next(config);
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable CORS
  server.use(cors());

  server.use(express.static('/uploads'));

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(config.port, (err?: any) => {
    if (err) throw err;
    console.log(`Server is running on ${config.hostname} port ${config.port}`);
  });
});


