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

var uri = "mongodb://openwsapp:heroku81282180@ds049150.mongolab.com:49150/heroku_app31135802"
// var uri = "mongodb://localhost:27017/heroku_app31135802"

// Opens connection with Mongo DB
MongoClient.connect(uri, function(err, db) {
  // if (!mongoClient) {
  //   console.error("Error! Exiting... Must start MongoDB first");
  //   process.exit(1);
  // }
  if(err) throw err;
  // var db = mongoClient.db("Openws");
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
