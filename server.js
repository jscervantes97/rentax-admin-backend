const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

//const DB = process.env.DATABASE_LOCAL;
//const DB = "mongodb://usrhousesin:U$rHSyN623@localhost:27017/housesin";
const DB = "mongodb://usrrentax:U$#r3N54X@rentaxadmin.esoft.com.mx:27017/rentax";
//const DB = "mongodb://usrhousesin:U$rHSyN623@housesin.esoft.com.mx:27017/housesin";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`Connected to ${DB}...`))
  .catch((err) => console.error('Could not connect to MongoDB...'));

const port = process.env.PORT || 3000;
// const port = 45205;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
}); 
