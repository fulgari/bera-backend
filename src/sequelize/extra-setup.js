function applyExtraSetup(sequelize) {
  // const { instrument, orchestra } = sequelize.models;
  // orchestra.hasMany(instrument);
  // instrument.belongsTo(orchestra);
  const { user, kanban } = sequelize.models;
  user.hasMany(kanban);
  kanban.belongsTo(user);
}

module.exports = { applyExtraSetup };
