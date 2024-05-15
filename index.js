const express = require ("express")
const app = express()
const db = require("./models")
const { Sequelize, SequelizeError } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req,res)=>{
    console.log("API is up");
})

app.post("/books", async (req, res) => {
    const data = req.body;
  
    try {
      const books = await db.Book.bulkCreate(data);
      res.status(201).send(books);
    } catch (err) {
      // Send a 400 Bad Request response if there's an error
      res.status(400).send(err.errors? err.errors.map((error) => error.message) : err.message);
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
        console.log(book);
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
        console.log('Updating book with ID:', id);
        console.log('Update data:', data);

        const [rowsUpdated, [updatedBook]] = await db.book.update(data, {
            where: {
                id: id
            },
            returning: true
        });

        console.log('Rows updated:', rowsUpdated);
        console.log('Updated book:', updatedBook);

        if (rowsUpdated === 0) {
            res.status(404).send('Book not found');
        } else {
            res.status(200).json({ message: 'Book updated', updatedBook });
        }
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const book = await db.Book.destroy({
      where: {
        id : id
      }
    });
    if (book === 0) {
      res.send('No records were deleted');
    } else {
      res.send(`{book} number of records were deleted`);
    }
  } catch (err) {
    res.send(err);
  }
});




db.sequelize.sync().then((req)=>{
    app.listen(3000, ()=>{
        console.log("server running on port 3000")
    });
})