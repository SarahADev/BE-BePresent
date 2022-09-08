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
}

exports.updateUser = async ({ userId }, { first_name, last_name, email }) => {
  const client = new MongoClient(uri);
  let toBeUpdated = "";
  first_name ? (toBeUpdated = { first_name: first_name }) : null;
  last_name ? (toBeUpdated = { last_name: last_name }) : null;
  email ? (toBeUpdated = { email }) : null;

  try {
    await client.connect();
    const database = client.db(data);
    const users = database.collection("users");

    const user = await users.updateOne(
      { user_id: userId },
      { $set: toBeUpdated }
    );

    if (user.matchedCount === 0) {
      console.log(user, "in reject")
      return await Promise.reject({ status: 404, msg: "User not found." });
    }

    const updatedUser = await users.findOne({ user_id: userId });

    return updatedUser;

  } finally {
    await client.close();
  }
};
