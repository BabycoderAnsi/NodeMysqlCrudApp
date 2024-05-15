const express = require ("express")
const app = express()
const db = require("./models")
const { Sequelize, SequelizeError } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.get("/getall",async (req,res)=>{
    console.log("API is up");
    const book = await db.Book.findAll({ });
    console.log(book)

    res.status(201).send(book);

}) 

app.post("/books", async (req, res) => {
    try {
      const data = req.body;
      console.log(data);
      const book = await db.Book.create(data);
      res.send(book);
    } catch (err) {
      // Send a 400 Bad Request response if there's an error
      res.send(err)
    }
  });

  app.get('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({ error: 'Invalid ID' });
      return;
    }
    try {
        const book = await db.Book.findOne({
          where: {
            id: id
          }
        });
        if (!book) res.send({
          Book: "Book not found"
        });
        res.send({
          Book: book
        });
      } catch (err) {
        res.send(err);
      }
  });

  app.put('/books/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
      const book = await db.Book.update(data, {
        where: {
          id: id
        }
      });
      res.send('book updated');
    } catch (err) {
      res.send(err);
    }
  });
  
  app.delete("/books/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const deletedCount = await db.Book.destroy({
        where: {
          id: id
        }
      });
      if (deletedCount === 0) {
        res.status(404).send('No records were deleted');
      } else {
        res.status(200).send(`${deletedCount} record(s) were deleted`);
      }
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });
  


db.sequelize.sync().then((req)=>{
    app.listen(3000, ()=>{
        console.log("server running on port 3000")
    });
})