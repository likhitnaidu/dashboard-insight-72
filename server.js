const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use('/api', router);

// Custom middleware for handling lesson updates (drag-and-drop)
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'PUT' && req.path.startsWith('/api/lessons')) {
    // Handle lesson order updates
    console.log('Updating lesson:', req.body);
  }
  next();
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});