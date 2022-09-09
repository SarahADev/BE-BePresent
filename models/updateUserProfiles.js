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

let count = 0;

exports.updateUserProfiles = async ({userId}, input) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(data);
        const users = database.collection("users");

        const currUser = await users.findOne({user_id: userId});

        if (!currUser) {
            return await Promise.reject({ status: 404, msg: "User not found." });
          };

        const checker = await currUser.profiles.forEach((connection) => {
            if (connection.name == input.name) {
                count++
            };
        });

        if (count > 0) {
            return await Promise.reject({
                status: 400,
                msg: "A profile with that name already exists"
            });
        };

        const user = await users.updateOne(
        { user_id: userId },
        { $push: {profiles: input} }
        );

        const updatedUser = await users.findOne({ user_id: userId });

    return updatedUser;
  
    } finally {
        await client.close();
    };
};