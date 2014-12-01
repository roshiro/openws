(function() {
  var mongo = require('mongodb');
  var hat   = require('hat');
  var Promise = require('node-promise').Promise;
  var when  = require('node-promise').when;

  var _apiKey = function(req) {
    return req.param("apiKey");
  },

  _errorHandler = function(response, error) {
    response.send(400,{msg: error});
  },

  _getNamespace = function(req, res) {
    var apiKey = _apiKey(req);
    var promise = new Promise();

    console.log("APIKey: " + apiKey);
    if(apiKey && apiKey.length > 0) {
      // TODO: Refactor to retrieve from DB
      if(apiKey == "b9276e788652f8287e80242dab6e5a2a") {
        promise.resolve("app");
      } else {
        collectionDriver.find("app.users", {api_key: apiKey}, function(err, objs) {
          if(err) promise.reject(err);

          if(objs && objs.length > 0) {
            promise.resolve(objs[0].email.replace('@','_'));
          } else {
            promise.reject("Invalid API Key");
          }
        });
      }
      return promise;
    }
  },

  _collection = function(req, res) {
    var promise = new Promise();
    when(_getNamespace(req, res), function(namespace) {
      promise.resolve(namespace + "." + req.params.collection);
    },
    function(err) {
      _errorHandler(res, err);
    });
    return promise;
  },

  _generateApiKey = function() {
    return hat();
  };

  exports.createUser = function(req, res) {
    var user = req.body;
    console.log("User signup/login request: " + user.email);
    collectionDriver.find("app.users", { user_id: user.user_id }, function(errors, objs) {
      if(errors) throw errors;

      if(objs.length > 0) {
        res.send(200, objs[0]);
      } else {
        user["api_key"] = _generateApiKey();
        collectionDriver.save("app.users", user, function(err, docs) {
          if (err) throw err;

          res.send(201, docs);
        });
      }
    });
  },

  exports.findAll = function(req, res) {
    var params = req.params;
    var query = req.param("q");

    var callback = function(err, objs) {
      if (err) {
        throw err;
      } else {
        res.set('Content-Type','application/json');
        res.send(200, objs);
      }
    };

    when(_collection(req,res),
      function(coll) {
        console.log("The coll is: " + coll);
        if(query) {
          collectionDriver.find(coll, JSON.parse(query), callback);
        } else {
          collectionDriver.findAll(coll, callback);
        }
      },
      function(err) {
        _errorHandler(res, err);
      }
    );
  };

  exports.get = function(req, res) {
    var params = req.params;
    var entity = params.entity;

    when(_collection(req,res),
      function(coll) {
        if(entity) {
          collectionDriver.get(coll, entity, function(error, objs) {
            if (error) { throw errors; }
            else { res.send(200, objs); }
          });
        }
      }, function(err) {
        _errorHandler(res, err);
      }
    );
  };

  exports.create = function(req, res) {
    var object = req.body;
    when(_collection(req,res), function(coll) {
      collectionDriver.save(coll, object, function(err,docs) {
        if (err) { res.send(400, err); }
        else { res.send(201, docs); }
      });
    },
    function(err) {
      _errorHandler(res, err);
    });
  };

  exports.update = function(req, res) {
    var params = req.params;
    var entity = params.entity;

    when(_collection(req,res),
      function(coll) {
        if (entity) {
          collectionDriver.update(coll, req.body, entity, function(err, objs) {
            if (err) { res.send(400, err); }
            else { res.send(200, objs); }
          });
        } else {
          var error = { "message" : "Cannot PUT a whole collection" };
          res.send(400, error)
        }
      },
      function(err) {
        _errorHandler(res, err);
      }
    );
  };

  exports.delete = function(req, res) {
    var params = req.params;
    var entity = params.entity;

    when(_collection(req,res), function(coll) {
        if (entity) {
          collectionDriver.delete(coll, entity, function(err, objs) { //B
            if (error) { res.send(400, err); }
            else { res.send(200, objs); }
          });
        } else {
          var error = { "message" : "Cannot DELETE a whole collection" };
          res.send(400, error);
        }
      },
      function(err) {
        _errorHandler(res, err);
      }
    );
  };

})();
