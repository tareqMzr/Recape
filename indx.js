import express from "express";
import {dirname} from "path";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const db=[
    {id:1, name:"John", age:30},
    {id:2, name:"Jane", age:25},
    {id:3, name:"Doe", age:22}
];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static("Public"));

app.get("/", (req, res) => {
    console.log(__dirname);
  res.sendFile(__dirname + "/Public/html.html");
});

app.post("/submit", authenticate ,(req, res) => {
    console.log(req.body);
  res.sendFile(__dirname + "/Public/html.html");
});

app.put("/update", authenticate, async (req, res) => {
  try {
      const id = parseInt(req.query.id);
      const data = {
          id: id,
          name: req.body.name,
          age: req.body.age
      };
    const index = db.findIndex(user => user.id === data.id);

    if (index !== -1) {
        db[index] = data;
    } else {
        db.push(data);
    }
    console.log(db);
    res.json({ message: "Data updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete", authenticate, async (req, res) => {
  try {
      const id = parseInt(req.query.id);
      const index = db.findIndex(user => user.id === id);
      console.log(db[index]);
      if (index !== -1) {
        db.splice(index, 1);
        console.log(db);
        res.json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ message: "Data not found" });
      }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function authenticate(req, res, next) {
    const authParms = req.query;
    console.log(authParms.id, authParms.key);
    if (authParms) {
        const token = authParms.key;
        if (token === process.env.token) {
            next();
        } else {
            res.sendStatus(403);
        }  
    } else {
        res.sendStatus(401);
    }
}