const swaggerAutogen = require('swagger-autogen')();
const params = 
 ['./app.js']
;

const Swagger = swaggerAutogen('./swagger.json',params);

module.exports = Swagger;