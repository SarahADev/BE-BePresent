const {MongoClient} = require('mongodb');
require ('dotenv').config();
const uri = process.env.URI;

exports.selectUsers = async () => {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const returnedUsers = await users.find().toArray()
        return returnedUsers;
    } finally {
        // ensures client closes when it finishes or error
        await client.close()
    }
}