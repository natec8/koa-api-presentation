const app = require('./src/app');
const port = process.argv[2];

app.listen(port);
console.log(`Server listening on port ${port}`);
