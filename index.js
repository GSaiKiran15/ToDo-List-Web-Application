import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import { database, password } from "pg/lib/defaults";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Todo",
  password: "saikiran",
  port: 5432,
});

db.connect();

let { rows: items } = await db.query("SELECT * FROM user_list");
let lengthItems = items.length;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  let { rows: items } = await db.query("SELECT * FROM user_list");
  lengthItems = items.length;
  console.log(lengthItems);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  lengthItems += 1;
  await db.query("INSERT INTO user_list VALUES ($1, $2)", [lengthItems, item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let newTitle = req.body.updatedItemTitle;
  let editTitleId = req.body.updatedItemId;
  items.find((element) => element.id == editTitleId).title = newTitle;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/delete", async (req, res) => {
  let itemId = parseInt(req.body.deleteItemId);
  await db.query("DELETE FROM user_list WHERE id = $1", [itemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
