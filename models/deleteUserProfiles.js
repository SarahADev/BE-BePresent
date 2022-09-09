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

exports.deleteUserProfiles = async ({userId}, {name}) => {
    console.log(userId, name);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(data);
        const users = database.collection("users");

        const currUser = await users.findOne({user_id: userId});

        const newProfilesArr = await currUser.profiles.filter((profile) => {
        return profile.name !== name;
        });

        const user = await users.updateOne(
            { user_id: userId },
            { $set: {profiles: newProfilesArr} }
            );

            console.log(user)

    } finally {
    await client.close();
};
}