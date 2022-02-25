const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
