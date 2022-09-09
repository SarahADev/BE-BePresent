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

exports.updateUserConnections = async ({userId}, {connections}) => {
  const client = new MongoClient(uri);
  
  let count = 0;
  
    try {
        await client.connect();
        const database = client.db(data);
        const users = database.collection("users");

        const checkUser = await users.findOne({email: connections});

        if (!checkUser) {
          return await Promise.reject({ status: 404, msg: "User not found." });
        };

        const currUser = await users.findOne({user_id: userId});

        const checker = await currUser.connections.forEach((connection) => {
            if (connection === checkUser.user_id) {
                count++
            };
        });

        if (count > 0) {
            return await Promise.reject({
                status: 400,
                msg: "You are already connected to that user!"
            });
        };

        const user = await users.updateOne(
        { user_id: userId },
        { $push: {connections: checkUser.user_id} }
        );

        const updatedUser = await users.findOne({ user_id: userId });

    return updatedUser;
  
    } finally {
        await client.close();
    };
};