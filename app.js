const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');
const roleRoutes = require('./routes/role');
const userRoutes = require('./routes/user');
const developmentRoutes = require('./routes/development');
const propertyRoutes = require('./routes/property');
const bannerRoutes = require('./routes/banner');
const sectorRoutes = require('./routes/sector');
const vacancyRoutes = require('./routes/vacancy');
const blogRoutes = require('./routes/blog');
const blogCategoryRoutes = require('./routes/blogCategory');
const rewardRoutes = require('./routes/reward');
const reviewRoutes = require('./routes/review');
const contactRequest = require('./routes/contactRequest');
const testimonyRequest = require('./routes/testimony') ;
const comertialAreaRequest = require('./routes/comertialArea') ;
const proyectGalleryRequest = require('./routes/finishProyectsGallery');
const app = express();

app.set('view engine', 'ejs');
// app.set("views", "views");

const routes = require('./routes');
const finishProyectsGallery = require('./models/finishProyectsGallery');

app.use(cors());
// app.options("*", cors());

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '50mb' }));

app.use(express.static(`${__dirname}/public`));
// app.use('images', express.static(`${__dirname}/images`));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Body parser, reading data from body into req.body
app.use(bodyParser.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/', routes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/development', developmentRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/sector', sectorRoutes);
app.use('/api/vacancy', vacancyRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/blogCategory', blogCategoryRoutes);
app.use('/api/reward', rewardRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/contactRequest', contactRequest);
app.use('/api/testimony', testimonyRequest);
app.use('/api/comertialArea', comertialAreaRequest);
app.use('/api/proyectGallery' , proyectGalleryRequest);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
