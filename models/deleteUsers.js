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

exports.deleteUserById = async ({ user_id }) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(data);
    const users = database.collection("users");
    const deletedUser = await users.deleteOne({ user_id: user_id });
    if (deletedUser.deletedCount === 0) {
      return await Promise.reject({ status: 404, msg: "User not found." });
    } else {
      return deletedUser;
    }
  } finally {
    await client.close();
  }
};
