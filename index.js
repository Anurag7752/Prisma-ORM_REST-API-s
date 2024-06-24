import "dotenv/config.js"
import express from "express";
import routes from './routes/index.js'

const app = express();

const PORT = process.env.PORT ||3000

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    return res.send("Hi Everyone")
})

app.use(routes)

app.listen(PORT,() => console.log(`server is listing on Port ${3000} `));
