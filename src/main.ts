import express from 'express';
import cors from 'cors';
const port = process.env.PORT || 8082;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/../public"));

app.listen(port, () => console.log("Server is running..."));
