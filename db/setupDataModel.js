const Sequelize = require('sequelize')

const MAX_CONNECTION_AGE = 1000 * 60 * 60 * 7.5

// To make UNIQUE indexes work as desired (i.e. only allowing one null column), this
// value is used instead of NULL.
const nullLikeDate = new Date('0000-01-01');

const createConnection = () => {

  const connection = new Sequelize(
    process.env.RDS_DB_NAME,
    process.env.RDS_USERNAME,
    process.env.RDS_PASSWORD,
    {
      dialect: 'mysql',
      dialectOptions: {
        multipleStatements: true,
      },
      host: process.env.RDS_HOSTNAME || 'localhost',
      port: process.env.RDS_PORT,
      logging: (query, msEllapsed) => (
        msEllapsed > 1000 ? console.log(`Slow query (${msEllapsed/1000} seconds). ${query}`) : null
      ),
      benchmark: true,
      pool: {
        // attempting to prevent the connection from becoming invalid due to mysql's wait_timeout
        validate: (obj) => {
          if(!obj.createdAt) {
            obj.createdAt = Date.now()
            return true
          }
          const isValid = Date.now() - obj.createdAt < MAX_CONNECTION_AGE
          if(!isValid) {
            console.log("Database connection being marked invalid.", obj.connectionId)
          }
          return isValid
        },
        max: 100,
      }
    }
  )

  const standardFields = {
    deletedAt: {
      type: Sequelize.DATE,
      defaultValue: nullLikeDate,
    },
  }

  const standardOptions = {
    paranoid: true,
    // this default scope was redundant, as paranoid already takes care of this
    // defaultScope: {
    //   where: {
    //     deletedAt: nullLikeDate,
    //   },
    // },
  }

  const standardIndexes = [
    {
      fields: ['deletedAt'],
    },
  ]

  const required = { foreignKey: { allowNull: false } };

  //////////////////////////////////////////////////////////////////

  // const Word = connection.define('tenant', Object.assign({
  //   domain: {
  //     type: Sequelize.STRING,
  //     allowNull: false,
  //     validate: {
  //       isUrl: true,
  //     },
  //   },
  //   defaultPageHeader: {
  //     type: Sequelize.JSON,
  //   },
  //   assetsVersion: {
  //     type: Sequelize.INTEGER.UNSIGNED,
  //     defaultValue: 1,
  //     allowNull: false,
  //   },
  // }, standardFields), Object.assign({
  //   indexes: [
  //     ...standardIndexes,
  //   ],
  // }, standardOptions))

  //////////////////////////////////////////////////////////////////

  // const BlackedListedEmail = connection.define('blackListedEmail', Object.assign({
  //   email: {
  //     type: Sequelize.STRING,
  //     allowNull: false,
  //     validate: {
  //       isEmail: true,
  //     },
  //   },
  //   cause: {
  //     type: Sequelize.ENUM('BOUNCE', 'COMPLAINT'),
  //     allowNull: false,
  //   },
  // }, standardFields), Object.assign({
  //   indexes: [
  //     ...standardIndexes,
  //     {
  //       fields: ['email'],
  //     },
  //     {
  //       fields: ['cause'],
  //     },
  //     {
  //       fields: ['tenantId'],
  //     },
  //   ],
  // }, standardOptions))

  // BlackedListedEmail.belongsTo(Tenant, required);
  // Tenant.hasMany(BlackedListedEmail);

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  createConnection,
  nullLikeDate,
}
