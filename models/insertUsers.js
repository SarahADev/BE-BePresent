const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.URI;

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

let data = "";
if (process.env.NODE_ENV === "test") {
  data = "test-data";
} else if (process.env.NODE_ENV === "development") {
  data = "app-data";
} else {
  console.log("no database set");
}

exports.insertUsers = async (newUser) => {
  const client = new MongoClient(uri);
  let {
    first_name,
    last_name,
    email,
    birth_day,
    birth_month,
    birth_year,
    password,
    interests,
  } = newUser;

  // creating unique user id

  const generatedUserId = uuidv4();
  const hashedpassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db(data);
    const users = database.collection("users");

    email = email.toLowerCase();

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return Promise.reject({ status: 409, msg: "User email already exists" });
    }

    const formatUser = {
      user_id: generatedUserId,
      first_name: first_name,
      last_name: last_name,
      email: email,
      birth_day: birth_day,
      birth_month: birth_month,
      birth_year: birth_year,
      hashed_password: hashedpassword,
      interests: interests,
      connections: [],
      profiles: []
    };

    await users.insertOne(formatUser);
    return formatUser;
    
  } finally {
    client.close();
  };
};
