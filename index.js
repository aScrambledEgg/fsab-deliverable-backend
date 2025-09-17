import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = 8080;

app.use(express.json())
app.use(
	cors({
		origin: "http://localhost:3000"
	})
)
app.use(bodyParser.urlencoded({ extended: false }))

// Create a route at http://localhost:8080/testRoute. You can try it with your browser!
app.get("/", async (req, res) => {
	res.send("Hello World!");
});

function start() {
	app.listen(port, () => {
		console.log(`Started listening on http://localhost:${port}. Try clicking on this link!`)
	})
}

start()
