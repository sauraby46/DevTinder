require('dotenv').config();

const express = require('express');
const connectDB = require("./config/database.js");
const cookieParser = require('cookie-parser');
const app = express();
const http = require("http");
const initializeSocket = require("./utils/socket");


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const requestRouter = require("./routes/requests.route.js");
const userRouter = require("./routes/user.route.js");
const paymentRouter = require("./routes/payment");
const cors = require('cors');
const chatRouter = require('./routes/chat.js');

app.use(
    cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {

      server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);

    });

        console.log("Database connected successfully");    

    })
    .catch((err) => {
        console.error("Database connection error:", err);  
    });

