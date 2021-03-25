const express = require("express");
const router = express.Router();

const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2",
  endpoint: "http://localhost:8000",
};

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

// get all users' thoughts
router.get("/users", (req, res) => {
  const params = {
    TableName: table,
  };

  // return all items in the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(data.Items);
    }
  });
});

// get thoughts from a user
router.get("/users/:username", (req, res) => {
  console.log(`Quering for thought(s) from ${req.params.username}.`);

  const params = {
    TableName: table,
    // determines which attributes or columns will be returned
    // similar to SELECT in SQL
    ProjectionExpression: "#th, #ca",
    // specifies the search criteria, used to filter the query, using comparison operators(=)
    // similar to WHERE in SQL
    KeyConditionExpression: "#un = :user",
    // defines the aliases used within the KeyConditionExpression (#un = username)
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
    },
    // defines the aliases for the attribute values (:user = #un = username = req.params.username)
    ExpressionAttributeValues: {
      ":user": req.params.username,
    },

    // determines the sort order, default is "true" which is ascending, "false" is descending
    ScanIndexForward: false,
  };
  // returns what's specified in the ProjectExpression. 
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err);
    } else {
      console.log("Query succeeded.", `${data.Items}`);
      res.json(data.Items);
    }
  });
});

// create a new thought.
router.post("/users", (req, res) =>{

  const params = {
    TableName: table,
    Item: {
      "username": req.body.username,
      "createdAt": Date.now(),
      "thought": req.body.thought,
    }
  }
// Add item to the Thoughts table.
dynamodb.put(params, (err, data) =>{
  if(err){
    console.error("Unable to add new entry. Error JSON:", JSON.stringify(err, null, 2));
    res.status(500).json(err);
  } else{
    console.log("Thought added successfully. Item:", JSON.stringify(data, null, 2));
    res.json({"Added:": JSON.stringify(data, null, 2)})
  }
});

});

module.exports = router;
