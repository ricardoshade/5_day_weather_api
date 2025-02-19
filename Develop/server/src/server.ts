import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.static(path.resolve(__dirname, '../client/dist')));

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));


export default app;