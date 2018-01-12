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

  const noTimestampsOptions = {
    timestamps: false,
  }

  const isArrayOfWordObjs = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    const wordObjStructure = {
      lemma: "string",
      strongs: "string",
      hits: "number",
      gloss: "string",
    }

    ary.forEach(wordObj => {
      if(typeof wordObj !== 'object') {
        throw new Error('Array must contain objects.')
      }
      
      Object.keys(wordObj).forEach(key => {
        if(typeof wordObj[key] !== wordObjStructure[key]) {
          throw new Error('Objects must match word object structure: ' + JSON.stringify(wordObjStructure))
        }
      })
    })
  }

  const isArrayOfLXXObjs = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    const lxxObjStructure = {
      w: "string",
      lemma: "string",
      strongs: "string",
      hits: "number",
      bhpHits: "number",
    }

    ary.forEach(wordObj => {
      if(typeof wordObj !== 'object') {
        throw new Error('Array must contain objects.')
      }
      
      Object.keys(wordObj).forEach(key => {
        if(typeof wordObj[key] !== lxxObjStructure[key]) {
          throw new Error('Objects must match lxx object structure: ' + JSON.stringify(lxxObjStructure))
        }
      })
    })
  }

  const isObjOfHits = obj => {
    if(typeof obj !== 'object') {
      throw new Error('Must be an object.')
    }
    
    Object.keys(obj).forEach(key => {
      if(typeof obj[key] !== "number") {
        throw new Error('Each object value must be a number.')
      }
    })
  }

  const strongsVersionRegEx = /^[0-9]{8}-[a-z0-9]{2,9}$/
  const strongsLangRegEx = /^[HAG][0-9]{1,4}[a-e]?-[a-z]{3}$/
  const strongsAnythingRegEx = /^[HAG][0-9]{1,4}[a-e]?-\w+$/

  const strongsVersionId = {
    type: Sequelize.STRING(20),
    primaryKey: true,
    validate: {
      is: strongsVersionRegEx,
    },
  }

  const strongsLangId = {
    type: Sequelize.STRING(10),
    primaryKey: true,
    validate: {
      is: strongsLangRegEx,
    },
  }

  const usfm = {
    type: Sequelize.TEXT,
    allowNull: false,
  }

  const required = { foreignKey: { allowNull: false } };

  //////////////////////////////////////////////////////////////////

  // const Word = connection.define('word', Object.assign({
  // }), Object.assign({
  //   indexes: [
  //   ],
  // }))

  //////////////////////////////////////////////////////////////////

  const Verse = connection.define('verse', Object.assign({
    id: strongsVersionId,
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const TagSet = connection.define('tagSet', Object.assign({
    id: strongsVersionId,
    tags: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  ////////////////////////////////////////////////////////////////////

  const Definition = connection.define('definition', Object.assign({
    id: strongsLangId,
    lemma: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    lemmaUnique: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    vocal: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    hits: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    gloss: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    syn: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isArrayOfWordObjs,
      },
    },
    rel: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isArrayOfWordObjs,
      },
    },
    lxx: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isArrayOfLXXObjs,
      },
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['lemma'],
      },
      {
        fields: ['lemmaUnique'],
      },
      {
        fields: ['hits'],
      },
      {
        fields: ['gloss'],
      },
    ],
  }, noTimestampsOptions))

  // //////////////////////////////////////////////////////////////////

  const PartOfSpeech = connection.define('partOfSpeech', Object.assign({
    pos: {
      type: Sequelize.ENUM('adjective', 'conjunction', 'adverb', 'noun', 'pronoun', 'preposition', 'particle', 'verb'),
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['pos'],
      },
    ],
  }, noTimestampsOptions))

  PartOfSpeech.belongsTo(Definition, required)
  Definition.hasMany(PartOfSpeech)

  // //////////////////////////////////////////////////////////////////

  const Hits = connection.define('hits', Object.assign({
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      validate: {
        is: strongsAnythingRegEx,
      },
    },
    hits: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['hits'],
      },
    ],
  }, noTimestampsOptions))

  // lxxHits: Hits   -- need to create a relationship so as to enable this item in the Definition object?
  // BlackedListedEmail.belongsTo(Tenant, required);
  // Tenant.hasMany(BlackedListedEmail);

  // //////////////////////////////////////////////////////////////////

  const Translation = connection.define('translation', Object.assign({
    id: strongsVersionId,
    tr: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isObjOfHits,
      },
    },
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  // //////////////////////////////////////////////////////////////////

  const LexEntry = connection.define('lexEntry', Object.assign({
    id: strongsLangId,
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  createConnection,
  nullLikeDate,
}
