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

var uri = process.env.MONGOLAB_URI;
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

app.set('port', (process.env.PORT || 5000));
app.use(express.bodyParser());

// Routes and handlers
app.get('/', function(request, response) {
  response.send('Openws is working')
});
app.get('/:collection', module.findAll);
app.get('/:collection/:entity', module.get);
app.post('/:collection', module.create);
app.put('/:collection/:entity', module.update);
app.delete('/:collection/:entity', module.delete);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
