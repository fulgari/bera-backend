const { DataTypes } = require("sequelize");

/**
 * id, date, listId, note, text, done, updatedAt, createdAt, isMD, tags
 * @param {*} sequelize 
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define("todorecord", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    date: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    listId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    note: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    text: {
      allowNull: false,
      type: DataTypes.STRING
    },
    done: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isMD: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    tags: {
      allowNull: true,
      type: DataTypes.STRING
    }
  });
};
