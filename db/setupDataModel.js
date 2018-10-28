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

  const isObjOfVersificationMappings = obj => {
    if(typeof obj !== 'object') {
      throw new Error('Must be an object.')
    }

    const mappingRegEx = /^(?:[0-9]{8}(?::[0-9]{1,3})?)?(?:-(?:[0-9]{8}(?::[0-9]{1,3})?)?)?$/
    
    Object.keys(obj).forEach(key => {
      if(!mappingRegEx.test(key)) {
        throw new Error('Invalid versification mapping key.')
      }
      if(typeof obj[key] !== "number" && !mappingRegEx.test(obj[key])) {
        throw new Error('Invalid versification mapping value.')
      }
    })
  }

  const isJSONArrayWithTwoStrings = jsonText => {
    let jsonObj

    try {
      jsonObj = JSON.parse(jsonText)
    } catch(e) {
      throw new Error('Must be in JSON format.')
    }

    if(!(jsonObj instanceof Array)) {
      throw new Error('Must be JSON array.')
    }

    if(jsonObj.length !== 2) {
      throw new Error('Must be JSON array with two items.')
    }

    if(jsonObj.some(item => typeof item !== 'string')) {
      throw new Error('Must be JSON array of two strings.')
    }
  }

  const versionIdRegEx = /^[a-z0-9]{2,9}$/
  const verseVersionIdRegEx = /^[0-9]{8}-[a-z0-9]{2,9}$/
  const strongsRegEx = /^[HAG][0-9]{5}[a-z]?$/
  const langRegEx = /^[a-z]{3}$/
  const strongsLangRegEx = /^[HAG][0-9]{5}[a-z]?-[a-z]{3}$/
  const strongsAnythingRegEx = /^[HAG][0-9]{5}[a-z]?-\w+$/

  const verseVersionId = {
    type: Sequelize.STRING(20),
    primaryKey: true,
    validate: {
      is: verseVersionIdRegEx,
    },
  }

  const strongsId = {
    type: Sequelize.STRING(11),
    primaryKey: true,
    validate: {
      is: strongsRegEx,
    },
  }

  const strongsLangId = {
    type: Sequelize.STRING(11),
    primaryKey: true,
    validate: {
      is: strongsLangRegEx,
    },
  }

  const usfm = {
    type: Sequelize.TEXT,
    allowNull: false,
  }

  const language = {
    type: Sequelize.STRING(3),
    allowNull: false,
    validate: {
      is: langRegEx,
    },
  }

  const required = { foreignKey: { allowNull: false } };

  //////////////////////////////////////////////////////////////////

  const oshbWord = connection.define('oshbWord', Object.assign({
    bookId: {
      type: Sequelize.INTEGER(7).UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 39,
      },
    },
    chapter: {
      type: Sequelize.INTEGER(8).UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 150,
      },
    },
    verse: {
      type: Sequelize.INTEGER(8).UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 176,
      },
    },
    number: {
      type: Sequelize.INTEGER(5).UNSIGNED,
      allowNull: false,
    },
    qere: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    word: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    append: {
      type: Sequelize.STRING(3),
    },
    prefix: {
      type: Sequelize.STRING(5),
    },
    strongs: {
      type: Sequelize.STRING(7),
      allowNull: false,
    },
    morph: {
      type: Sequelize.STRING(20),
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['bookId'],
      },
      {
        fields: ['chapter'],
      },
      {
        fields: ['verse'],
      },
      {
        fields: ['number'],
      },
      {
        fields: ['qere'],
      },
      {
        fields: ['prefix'],
      },
      {
        fields: ['strongs'],
      },
      {
        fields: ['morph'],
      },
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const oshbVerse = connection.define('oshbVerse', Object.assign({
    id: verseVersionId,
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const TagSet = connection.define('tagSet', Object.assign({
    id: verseVersionId,
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
    id: strongsId,
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
    ],
  }, noTimestampsOptions))

  // TODO: I need a many-to-may relationship here, indicating synonyms and related words in a language agnostic way
  // This relationship will be used for producing the language-specific definition rows each time these relationships
  // or a gloss is updated.

  ////////////////////////////////////////////////////////////////////

  const EngDefinition = connection.define('engDefinition', Object.assign({
    id: strongsLangId,
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
  }), Object.assign({
    indexes: [
      {
        fields: ['gloss'],
      },
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const PartOfSpeech = connection.define('partOfSpeech', Object.assign({
    pos: {
      type: Sequelize.ENUM('A', 'C', 'D', 'N', 'P', 'R', 'T', 'V'),
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

  //////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////

  const Translation = connection.define('translation', Object.assign({
    id: verseVersionId,
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

  //////////////////////////////////////////////////////////////////

  const LexEntry = connection.define('lexEntry', Object.assign({
    id: strongsLangId,
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const VersionInfo = connection.define('versionInfo', Object.assign({
    id: {
      type: Sequelize.STRING(9),
      primaryKey: true,
      validate: {
        is: versionIdRegEx,
      },
    },
    name: {
      type: Sequelize.STRING(150),
      allowNull: false,
      notEmpty: true,
    },
    language,
    wordDividerRegex: {
      type: Sequelize.STRING(100),
    },
    versificationModel: {
      type: Sequelize.INTEGER(8).UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    exceptionalVersificationMappings: {
      type: Sequelize.JSON,
      validate: {
        isObjOfVersificationMappings,
      },
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['name', 'language', 'versificationModel'],
      },
    ],
  }))

  //////////////////////////////////////////////////////////////////

  const UiWord = connection.define('uiWord', Object.assign({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    str: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
    },
    desc: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
    language,
    translation: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['str', 'desc', 'language'],
      },
    ],
  }))

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  createConnection,
  nullLikeDate,
}
