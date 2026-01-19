const express = require('express');
const connectDB = require("./config/database.js");
const cookieParser = require('cookie-parser');
const app = express();


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const requestRouter = require("./routes/requests.route.js");
const userRouter = require("./routes/user.route.js");
const cors = require('cors');

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
    .then(() => {

      app.listen(3000, () => {
        console.log('Server is running on port 3000');

    });

        console.log("Database connected successfully");    

    })
    .catch((err) => {
        console.error("Database connection error:", err);  
    });

