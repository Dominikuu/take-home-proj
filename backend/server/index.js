// @ts-check

const { Client } = require("pg");
const express = require("express");
const app = express();
const port = 3030;

const client = new Client({
  password: "password",
  user: "admin",
  host: "postgres",
  port: 5432,
  database: "pi-coin"
});

app.use(express.static("public"));

app.get("/salary", async (req, res) => {
  const results = await client
    .query("SELECT * FROM salary")
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

(async () => {
  
  await client.connect();
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();

