const sequelize = require("../../sequelize");
const mysql = require("mysql2/promise");
const dbConfig = require("../mysql-example-database/config/db.config");
const { pickRandom, randomDate } = require("./helpers/random");

async function reset() {
  console.log("Will rewrite the MySQL example database, adding some dummy data.");

  // mysql
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.db}\`;`);

  await sequelize.sync({ force: true });

  await sequelize.models.user.bulkCreate([
    { username: "admin", password: "admin", email: "admin@bera.com" },
    { username: "jack-sparrow", password: "123123", email: "js@bera.com" },
    { username: "white-beard", password: "123123", email: "wb@bera.com" },
    { username: "black-beard", password: "123123", email: "bb@bera.com" },
    { username: "brown-beard", password: "123123", email: "bb2@bera.com" },
  ]);

  await sequelize.models.kanban.bulkCreate([
    { title: "work", userId: 1 },
    { title: "learn", userId: 1 },
    { title: "fish", userId: 2 },
  ]);

  await sequelize.models.todorecord.bulkCreate([
    { title: "todo 1", description: "check check", kanbanId: 1 },
    { title: "todo 2", kanbanId: 1 },
    { title: "todo 3", kanbanId: 2 },
  ]);

  // await sequelize.models.orchestra.bulkCreate([
  // 	{ name: 'Jalisco Philharmonic' },
  // 	{ name: 'Symphony No. 4' },
  // 	{ name: 'Symphony No. 8' },
  // ]);

  // Let's create random instruments for each orchestra
  // for (const orchestra of await sequelize.models.orchestra.findAll()) {
  // 	for (let i = 0; i < 10; i++) {
  // 		const type = pickRandom([
  // 			'violin',
  // 			'trombone',
  // 			'flute',
  // 			'harp',
  // 			'trumpet',
  // 			'piano',
  // 			'guitar',
  // 			'pipe organ',
  // 		]);

  // 		await orchestra.createInstrument({
  // 			type: type,
  // 			purchaseDate: randomDate()
  // 		});

  // 		// The following would be equivalent in this case:
  // 		// await sequelize.models.instrument.create({
  // 		// 	type: type,
  // 		// 	purchaseDate: randomDate(),
  // 		// 	orchestraId: orchestra.id
  // 		// });
  // 	}
  // }

  console.log("Done!");
}

reset();
