const {MongoClient} = require('mongodb');
require ('dotenv').config();
const uri = process.env.URI;

let data = '';
if (process.env.NODE_ENV === 'test') {
    data = 'test-data';
} else if (process.env.NODE_ENV === 'development') {
    data = 'app-data';
} else {
    console.log('no database set');
};

exports.selectUserById = async (id) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db(data);
        const users = database.collection('users');
        
        const user = await users.findOne({user_id: id});
        if (!user) {
            return await Promise.reject({status: 404, msg: "user not found"});
        } else return user;
    } finally {
        await client.close();
    };
};