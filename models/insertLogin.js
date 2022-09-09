const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.URI;
const bcrypt = require("bcrypt");

let data = "";
if (process.env.NODE_ENV === "test") {
  data = "test-data";
} else if (process.env.NODE_ENV === "development") {
  data = "app-data";
} else {
  console.log("no database set");
}

exports.insertLogin = async ({ email, password }) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(data);
    const users = database.collection("users");

    //   checking if email exists, and comparing hashed password
    const user = await users.findOne({ email });
    if (!user) {
      return await Promise.reject({ status: 400, msg: "Invalid credentials" });
    }

    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    const loggedUser = user

    if (user && correctPassword) {
      return loggedUser;
    } else {
      return await Promise.reject({ status: 400, msg: "Invalid credentials" });
    }
  } finally {
    await client.close();
  }
};
