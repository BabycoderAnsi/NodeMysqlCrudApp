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

app.post("/createbooks/", async (req, res) => {
    try {
      const data = req.body;
      const book = await db.Book.create(data);
      console.log(data);
      res.send(book);
    } catch (err) {
      // Send a 400 Bad Request response if there's an error
      res.send(err)
    }
  });

  app.get('/showbook/', async (req, res) => {
    const id = parseInt(req.query.id);
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
      if (!book) return res.send({ Book: "Book not found" });
      res.send({ Book: book });
    } catch (err) {
      res.send(err);
    }
  });
  

  app.put('/updatebooks/', async (req, res) => {
    try {
      const id = parseInt(req.query.id);
      const data = req.body;
      
      // Update the book record
      await db.Book.update(data, { where: { id: id } });

      // Retrieve the updated book record
      const updatedBook = await db.Book.findOne({ where: { id: id } });

      // Send the updated book record in the response
      res.send({ Book: updatedBook });
    } catch (err) {
      res.send(err);
    }
});

  
  app.delete("/deletebooks/", async (req, res) => {
    const id = parseInt(req.query.id);
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
  


db.sequelize.sync().then(()=>{
    app.listen(3000, ()=>{
        console.log("server running on port 3004")
    });
})