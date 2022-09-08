const mongoose = require('mongoose');

const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database connected!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
