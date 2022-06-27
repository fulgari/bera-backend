function applyExtraSetup(sequelize) {
  // const { instrument, orchestra } = sequelize.models;
  // orchestra.hasMany(instrument);
  // instrument.belongsTo(orchestra);
  const { user, kanban, todorecord } = sequelize.models;
  user.hasMany(kanban);
  kanban.belongsTo(user);
  kanban.hasMany(todorecord);
  todorecord.belongsTo(kanban);
}

module.exports = { applyExtraSetup };
