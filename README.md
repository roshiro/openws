Creating

    $ curl -X POST -H "Content-Type: application/json" -d '{"title":"Hey, Im using crud_ws", "slides": [{"1":"test"}, {"2": "Another test"}]}' http://127.0.0.1:3000/cruds

Retrieving

    $ curl -i -H "Accept: application/json" http://127.0.0.1:3000/cruds

Updating

    $ curl X PUT -i -H "Accept: application/json" -d 'title'='This is the updated title' http://127.0.0.1:3000/cruds/23cd6e44-d2b4-47d0-ba87-b788c496c82c

Deleting

    $ curl -X DELETE -i -H "Accept: application/json" http://127.0.0.1:3000/cruds/446a7bc3-d54c-4f1b-812f-b8daa9bc2016
