const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const manufacturerRouter = require('./routes/manufacturer');
const catesubcateRouter = require('./routes/cate-subcategories');
const accesroriesRouter = require('./routes/accesories');
// const utilsMiddleware = require('./middleware/utilsMiddleware');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
// app.use(utilsMiddleware);

app.use('/productos', productsRouter);
app.use('/categorias', categoriesRouter);
app.use('/fabricantes', manufacturerRouter);
app.use('/catesubcate', catesubcateRouter);
app.use('/accesorios', accesroriesRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});