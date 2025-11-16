const express = require('express');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');

const app = express();
const port = 3000;
require('dotenv').config();

// Routers
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const manufacturerRouter = require('./routes/manufacturer');
const catesubcateRouter = require('./routes/cate-subcategories');
const accesroriesRouter = require('./routes/accesories');
const tasksRouter = require('./routes/tasks');
const uploadRouter = require('./routes/upload');
const uploadimageaccesoriesRouter = require('./routes/upload-image-accesories');
const accessoriesbaseRouter = require('./routes/accessories-base');
const accessoriesmanufacturerRouter = require('./routes/accessories-manufacturer');
const accesoriescatesubcateRouter = require('./routes/accesories-cate-subcategories');
const accesoriestasksRouter = require('./routes/accesories-tasks');
const categoriesaccesoriesRouter = require('./routes/categories-accesories');
const ordersdropdownRouter = require('./routes/orders-dropdowns');
const articletypeRouter = require('./routes/article-type');
const ordersbaseRouter = require('./routes/orders-base');
const usersRouter = require('./routes/users');
const userrolesRouter = require('./routes/users-roles');
const userstates = require('./routes/users-states');
const authRoutes = require('./routes/auth');
const verifyToken = require('./routes/protected');
const clientesRouter = require('./routes/clients');
const suppliesRouter = require('./routes/supplies-base');
const suppliesmanufacturerRouter = require('./routes/supplies-manufacturer');
const suppliescatesubcateRouter = require('./routes/supplies-cate-subcategories');
const categoriessuppliesRouter = require('./routes/categories-supplies');
const uploadimageinsumosRouter = require('./routes/upload-image-supplies');
const servicesbaseRouter = require('./routes/services-base');
const articlelistRouter = require('./routes/article-list');
const salesbaseRouter = require('./routes/sales-base');
const creditnotesRouter = require('./routes/credit-notes');
const shoppingCartRouter = require('./routes/shopping-cart');
const inventoryRouter = require('./routes/inventory');
const dashboardRouter = require('./routes/dashboard');
const preIngresoRoutes = require('./routes/pre-ingreso');
const costdistributionRouter = require('./routes/cost-distribution');
const validationRoutes = require('./routes/validation');
const producttypesRouter = require('./routes/product-types');
const tiposAccesoriosRouter = require('./routes/accesories-list');
const backupRouter = require('./routes/backup');
// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Servir archivos estáticos de las carpetas de imágenes
app.use('/img-consolas', express.static(path.join(__dirname, '..', 'public', 'img-consolas')));
app.use('/img-accesorios', express.static(path.join(__dirname, '..', 'public', 'img-accesorios')));
app.use('/img-insumos', express.static(path.join(__dirname, '..', 'public', 'img-insumos')));
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));


const consolasImagesDir = path.join(__dirname, '..', 'public', 'img-consolas');
const accesoriosImagesDir = path.join(__dirname, '..', 'public', 'img-accesorios');
const insumosImagesDir = path.join(__dirname, '..', 'public', 'img-insumos');

// 2. Crea el endpoint GET para listar las imágenes de CONSOLAS (PRODUCTOS)
app.get('/imagenes-existentes-productos', (req, res) => {
  fs.readdir(consolasImagesDir, (err, files) => {
    if (err) {
      console.error('No se pudo leer el directorio de imágenes de consolas:', err);
      return res.status(500).send('Error al leer el directorio de imágenes.');
    }
    res.json(files);
  });
});

// 3. Endpoint GET para listar las imágenes de ACCESORIOS (Ya existente)
app.get('/imagenes-existentes-accesorios', (req, res) => {
  fs.readdir(accesoriosImagesDir, (err, files) => {
    if (err) {
      console.error('No se pudo leer el directorio de imágenes de accesorios:', err);
      return res.status(500).send('Error al leer el directorio de imágenes.');
    }
    res.json(files);
  });
});

// 4. Crea el endpoint GET para listar las imágenes de INSUMOS
app.get('/imagenes-existentes-insumos', (req, res) => {
  fs.readdir(insumosImagesDir, (err, files) => {
    if (err) {
      console.error('No se pudo leer el directorio de imágenes de insumos:', err);
      return res.status(500).send('Error al leer el directorio de imágenes.');
    }
    res.json(files);
  });
});


// --- DEFINICIÓN DE RUTAS PRINCIPALES DE LA API ---

app.use('/productos', productsRouter);
app.use('/categorias', categoriesRouter);
// ... (el resto de tus app.use no necesita cambios)
app.use('/fabricantes', manufacturerRouter);
app.use('/catesubcate', catesubcateRouter);
app.use('/accesorios', accesroriesRouter);
app.use('/tareas', tasksRouter); 
app.use('/upload-imagen-producto', uploadRouter); // <-- CORREGIDO: Ruta renombrada para consistencia
app.use('/accesorios-base', accessoriesbaseRouter);
app.use('/fabricantes-accesorios', accessoriesmanufacturerRouter);
app.use('/catesubcate-accesorios', accesoriescatesubcateRouter);
app.use('/tareas-accesorios',accesoriestasksRouter);
app.use('/upload-imagen-accesorios', uploadimageaccesoriesRouter);
app.use('/upload-imagen-insumos', uploadimageinsumosRouter);
app.use('/categorias-accesorios', categoriesaccesoriesRouter);
app.use('/pedidos-dropdown',ordersdropdownRouter);
app.use('/articulos', articletypeRouter);
app.use('/pedidos', ordersbaseRouter);
app.use('/usuarios',usersRouter);
app.use('/roles',userrolesRouter);
app.use('/estados-usuarios',userstates)
app.use('/insumos-base', suppliesRouter); 
app.use('/fabricantes-insumos', suppliesmanufacturerRouter); 
app.use('/catesubcate-insumos', suppliescatesubcateRouter); 
app.use('/categorias-insumos', categoriessuppliesRouter);
app.use('/clientes', clientesRouter); 
app.use('/servicios-base', servicesbaseRouter); 
app.use('/articulo-lista', articlelistRouter); 
app.use('/ventas-base', salesbaseRouter); 
app.use('/notas-credito', creditnotesRouter); 
app.use('/auth', authRoutes); 
app.use('/carrito', shoppingCartRouter); 
app.use('/inventario', inventoryRouter); 
app.use('/dashboard', dashboardRouter); 
app.use('/api/pre-ingreso', preIngresoRoutes);
app.use('/api/cost-distribution', costdistributionRouter); 
app.use('/api/validate', validationRoutes); 
app.use('/api/tipos-producto', producttypesRouter);
app.use('/api/tipos-accesorios', tiposAccesoriosRouter);
app.use('/api/backup', backupRouter);
// Rutas protegidas
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Acceso permitido' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});