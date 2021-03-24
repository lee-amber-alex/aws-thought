const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  region: "us-eas-2",
  endpoint: "http://localhost:8000",
});

// DocumentClient() to create the dynamodb service object
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

console.log("Importing thoughts into DynamoDB. Please wait.");

// The relative path for the fs.readFileSync function 
// is relative to where the file is executed, not the path between files.
const allUsers = JSON.parse(
  fs.readFileSync("./server/seed/users.json", "utf8")
);

// loop over allUsers to create params object

allUsers.forEach( user =>{
  const params = {
    TableName: "Thoughts",
    Item: {
      "username": user.username,
      "createdAt": user.createdAt,
      "thought": user.thought
    }
  };
  dynamodb.put(params, (err,data) =>{
    if(err){
      console.error("Unable to add thought", user.username,".Error JSON:", JSON.stringify(err, null, 2))
    } else{
      console.log("PutItem succeed", user.username)
    }
  })
});



