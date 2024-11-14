const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const app = express();
const port = 3000;

// Routers
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const manufacturerRouter = require('./routes/manufacturer');
const catesubcateRouter = require('./routes/cate-subcategories');
const accesroriesRouter = require('./routes/accesories');
const tasksRouter = require('./routes/tasks');
const uploadRouter = require('./routes/upload');
const accessoriesbaseRouter = require('./routes/accessories-base');
const accessoriesmanufacturerRouter = require('./routes/accessories-manufacturer');
const accesoriescatesubcateRouter = require('./routes/accesories-cate-subcategories');

// Middleware
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Serve static files from the public/img-consolas directory
app.use('/img-consolas', express.static(path.join(__dirname, '..', 'public', 'img-consolas')));

// Define your routes
app.use('/productos', productsRouter);
app.use('/categorias', categoriesRouter);
app.use('/fabricantes', manufacturerRouter);
app.use('/catesubcate', catesubcateRouter);
app.use('/accesorios', accesroriesRouter);
app.use('/tareas', tasksRouter);
app.use('/upload', uploadRouter);
app.use('/accesorios-base', accessoriesbaseRouter);
app.use('/fabricantes-accesorios', accessoriesmanufacturerRouter);
app.use('/catesubcate-accesorios', accesoriescatesubcateRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});