var http = require('http'),
    express = require('express'),
    module = require('./modules/mongo_crud'),
    app = express(),
    // uri = process.env.MONGOLAB_URI;

    uri = "mongodb://localhost:27017/Openws";

CollectionDriver = require('./modules/collection_driver').CollectionDriver;
MongoClient = require('mongodb').MongoClient;

// Opens connection with Mongo DB
MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
  collectionDriver = new CollectionDriver(db);
  console.info("Database connection OK");
});

app.set('port', (process.env.PORT || 5000));
app.use(express.bodyParser());
app.use(function(req, res, next) {
  // Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes and handlers
app.post('/api/users/new', module.createUser);
app.get('/', function(request, response) {response.send('Openws is working')});
app.get('/:collection', module.findAll);
app.get('/:collection/:entity', module.get);
app.post('/:collection', module.create);
app.put('/:collection/:entity', module.update);
app.delete('/:collection/:entity', module.delete);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
