const exp = require("express");
const app = exp();
require("dotenv").config();
const mongoose = require("mongoose");
const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/authorApi");
const adminApp = require("./APIs/adminApi");
const cors = require("cors");

// ✅ Use CORS with frontend URL from env
app.use(cors({
    origin: process.env.CLIENT_URL,   // e.g. https://my-blog-frontend.vercel.app
    credentials: true
}));

// ✅ Middleware
app.use(exp.json());

// ✅ Routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);

// ✅ Database + Server startup
const port = process.env.PORT || 4000;
mongoose.connect(process.env.DBURL)   // or process.env.MONGODB_URI if you rename
    .then(() => {
        app.listen(port, "0.0.0.0", () =>
            console.log(`✅ Server listening on port ${port}..`)
        );
        console.log("✅ DB connection success");
    })
    .catch(err => console.log("❌ Error in DB connection:", err));

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Error object in express error handler:", err);
    res.status(500).send({ message: err.message });
});
