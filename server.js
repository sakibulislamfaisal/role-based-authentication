const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connect Successfully!"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port} 🔥`)
);
