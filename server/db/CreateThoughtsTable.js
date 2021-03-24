const AWS = require("aws-sdk");

// config points to local instance,
// updates local environmental variables

AWS.config.update({
    region: "us-eas-2",
    endpoint: "http://localhost:8000"
})

const dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"})

// Next we'll create a params object that will hold the schema and metadata of the table

const params = {
    // designate table name
    TableName : "Thoughts",
    // define the partition key and the sort key
    KeySchema: [       
        { AttributeName: "username", KeyType: "HASH"},  //Partition key
        { AttributeName: "createdAt", KeyType: "RANGE" }, /*Sort key */
       
        
    ],
    // defines the attributes we've used for the hash and range keys
    AttributeDefinitions: [       
        { AttributeName: "username", AttributeType: "S" }, /*string*/
        { AttributeName: "createdAt", AttributeType: "N" }, /*number*/
        
        
    ],
    // maximum write and read capacity of the database
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

// create table method using schema params
dynamodb.createTable(params, (err, data) =>{
    if(err){
        console.error("Table not created. Error JSON:", JSON.stringify(err, null, 2))
    } else {
        console.log("Table created. Description JSON:", JSON.stringify(data, null, 2))
    }
})
