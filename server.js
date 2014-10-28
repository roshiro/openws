var express = require('express'),
    module = require('./modules/mongo_crud'),
    CollectionDriver = require('./modules/collection_driver').CollectionDriver,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server
    app = express();

var mongoHost = 'localHost',
    mongoPort = 27017,
    collectionDriver,
    mongoClient = new MongoClient(new Server(mongoHost, mongoPort));

mongoClient.open(function(err, mongoClient) {
  if (!mongoClient) {
    console.error("Error! Exiting... Must start MongoDB first");
    process.exit(1);
  }
  var db = mongoClient.db("Openws");
  collectionDriver = new CollectionDriver(db);
});

app.use(express.bodyParser());
app.get('/:collection', module.findAll);
app.get('/:collection/:entity', module.get);
app.post('/:collection', module.create);
app.put('/:collection/:entity', module.update);
app.delete('/:collection/:entity', module.delete);
// app.get('/cruds', module.findAll);
// app.get('/cruds/:id', module.findById);
// app.post('/cruds', module.create);
// app.delete('/cruds/:id', module.delete);
// app.put('/cruds/:id', module.update);

app.listen(3000);
console.log('Listening on port 3000...');
