module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define(
      'Book', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
        },
        author: {
          type: DataTypes.STRING,
        },
      },
    );
    return Book;
  };