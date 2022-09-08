const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.URI;

let data = "";
if (process.env.NODE_ENV === "test") {
  data = "test-data";
} else if (process.env.NODE_ENV === "development") {
  data = "app-data";
} else {
  console.log("no database set");
};

exports.deleteUserConnection = async ({userId}, {connection_id}) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(data);
        const users = database.collection("users")

        const currUser = await users.findOne({user_id: userId});

        const newConnectionsArr = await currUser.connections.filter((connection) => {
        return connection !== connection_id;
        });

        const user = await users.updateOne(
            { user_id: userId },
            { $set: {connections: newConnectionsArr} }
            );

    } finally {
        await client.close();
    };
};