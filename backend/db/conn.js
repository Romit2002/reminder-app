const mongoose = require("mongoose");

const connectDb = (uri) => {
    // console.log("DataBase Connected!!!");
    return mongoose.connect(uri);
}

module.exports = {connectDb};