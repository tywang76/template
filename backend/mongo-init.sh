#!/bin/bash
# Wait for MongoDB to be ready
sleep 10

# Initialize replica set
mongo --eval "
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongo:27017' }
  ]
})
"
