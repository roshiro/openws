CollectionDriver = require('./modules/collection_driver').CollectionDriver;
MongoClient = require('mongodb').MongoClient;
Server = require('mongodb').Server;

var http = require('http'),
    express = require('express'),
    module = require('./modules/mongo_crud'),
    app = express(),
    mongoHost = 'localhost',
    mongoPort = 27017,
    mongoClient = new MongoClient(new Server(mongoHost, mongoPort));

// Opens connection with Mongo DB
mongoClient.open(function(err, mongoClient) {
  if (!mongoClient) {
    console.error("Error! Exiting... Must start MongoDB first");
    process.exit(1);
  }
  var db = mongoClient.db("Openws");
  collectionDriver = new CollectionDriver(db);
  console.info("Database connection OK");
});

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());

// Routes and handlers
app.get('/:collection', module.findAll);
app.get('/:collection/:entity', module.get);
app.post('/:collection', module.create);
app.put('/:collection/:entity', module.update);
app.delete('/:collection/:entity', module.delete);

// Starts server on port 3000
app.listen(3000);
console.log('Listening on port 3000...');
