var frisby = require('frisby');

frisby.create('Creates an entry')
  .post('http://127.0.0.1:3000/dummy_items', {
    product: "TV Set",
    price: 123.02
  })
  .expectStatus(201)
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectJSONTypes({
    product: String,
    price: String,
    created_at: String,
    _id: String
  })
  .inspectBody()
.toss();
