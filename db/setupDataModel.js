const Sequelize = require('sequelize')
const {
  wordIdRegEx,
  verseIdRegEx,
  versionIdRegEx,
  definitionIdRegEx,
  languageIdRegEx,
  scopeRegEx,
} = require('../graphql/utils')

const MAX_CONNECTION_AGE = 1000 * 60 * 60 * 7.5

// To make UNIQUE indexes work as desired (i.e. only allowing one null column), this
// value is used instead of NULL.
const nullLikeDate = new Date('0000-01-01')

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
    // Used in tables which can be completed derived from other tables and base import files.
    timestamps: false,
  }

  const isArrayOfWordObjs = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    const wordObjStructure = {
      lex: "string",
      id: "string",
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

  const isLexEntry = obj => {
    if(typeof obj !== 'object') {
      throw new Error('Must be an object.')
    }

    // Eg.
    // const obj = {
    //   lemmas: ["string"],
    //   poss: [
    //     {
    //       pos: "verb",
    //       types: [
    //         {
    //           type: "transitive",
    //           meaning: [
    //             {
    //               text: "transitive def",
    //               perc: "88",
    //             },
    //           ],
    //         },
    //         {
    //           ...
    //         },
    //       ]
    //     }
    //   ],
    // }
  }

  const isArrayOfLXXObjs = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    const lxxObjStructure = {
      w: "string",
      lex: "string",
      id: "string",
      hits: "number",
      ugntHits: "number",
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

  const isVerseMappings = obj => {

    if(typeof obj !== 'object') {
      throw new Error('Must be an object.')
    }

    const singleVerseRegEx = /^[0-9]{8}(?::[0-9]{1,3}(?:-[0-9]{1,3})?)?$/
    const rangeRegEx = /^[0-9]{8}(?:-[0-9]{3})?$/
    
    Object.keys(obj).forEach(key => {
      if(singleVerseRegEx.test(key) && singleVerseRegEx.test(obj[key])) {
        // Valid option. Examples:
        // "02011030": "02012001",
        // "05022005:1-5": "05022005",
        // "05022005:6-10": "05022006",
        // "08002009:5-10": "08002009:1-7",
        // "08002010:1-2": "08002009:8-9",
        
      } else if(rangeRegEx.test(key) && typeof obj[key] === "number") {
        // Valid option. Example:
        // "02012001-021": -1,

      } else {
        throw new Error(`Invalid versification rule. ${key}: ${obj[key]}`)
      }
    })
  }

  const wordId = {
    type: Sequelize.STRING(4),
    primaryKey: true,
    validate: {
      is: wordIdRegEx,
    },
  }

  const verseId = {
    type: Sequelize.STRING(8),
    primaryKey: true,
    validate: {
      is: verseIdRegEx,
    },
  }

  const scope = {
    type: Sequelize.STRING(2),
    primaryKey: true,
    validate: {
      is: scopeRegEx,
    },
  }

  const hits = {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  }

  const usfm = {
    type: Sequelize.TEXT,
    allowNull: false,
  }

  const nakedWord = {  // no capitalization, accents, vowels or diacritical marks
    type: Sequelize.STRING(30),
    allowNull: false,
  }

  const lemma = {
    type: Sequelize.STRING(50),
    allowNull: false,
  }

  const bookId = {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      min: 1,
      max: 87,  // 67+ are deuterocanonical (for the LXX)
    },
  }

  const chapter = {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      min: 1,
      max: 151,
    },
  }
  
  const verse = {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      min: 1,
      max: 176,
    },
  }

  const wordNumber = {  // in a book (not in a verse); null if it is a variant; used for quoted searches
    type: Sequelize.INTEGER.UNSIGNED,
  }

  const verseNumber = {  // in a book (not in a chapter); used by same:verses:# tag
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  }

  const greekPos = {
    type: Sequelize.ENUM('N', 'A', 'E', 'R', 'V', 'I', 'P', 'D', 'C', 'T'),
    allowNull: false,
  }

  const greekType = {  // includes the pos to remove ambiguity
    type: Sequelize.ENUM(
      'NS', 'NP', 'AA', 'AR', 'EA', 'ED', 'EF', 'EP', 'EQ', 'EN', 'EO', 'ER',
      'ET', 'RD', 'RE', 'RP', 'RC', 'RI', 'RR', 'RT', 'VT', 'VI', 'VL', 'VM',
      'VP', 'IE', 'ID', 'IR', 'PI', 'DO', 'CC', 'CS', 'CO', 'TF'
    ),
  }

  const greekMood = {
    type: Sequelize.ENUM('I', 'M', 'S', 'O', 'N', 'P'),
  }

  const greekAspect = {
    type: Sequelize.ENUM('P', 'I', 'F', 'A', 'E', 'L'),
  }

  const greekVoice = {
    type: Sequelize.ENUM('A', 'M', 'P'),
  }

  const greekPerson = {
    type: Sequelize.ENUM('1', '2', '3'),
  }

  const greekCase = {
    type: Sequelize.ENUM('N', 'D', 'G', 'A', 'V'),
  }

  const greekGender = {
    type: Sequelize.ENUM('M', 'F', 'N'),
  }

  const greekNumber = {
    type: Sequelize.ENUM('S', 'P'),
  }

  const greekAttribute = {
    type: Sequelize.ENUM('C', 'S', 'D', 'I'),
  }

  const type = {
    type: Sequelize.ENUM(
      'imported',  // i.e. imported from some data set, without very strong rating or secondary confirmation
      'submitted',  // i.e. submitted by user, without very strong rating or secondary confirmation
      'deduced',  // i.e. determined by user submissions in other verses, without secondary confirmation
      'confirmed'  // i.e. cross-checked in 2+ ways, or submitted by user/import with very strong rating
    ),
    allowNull: false,
  }

  const required = { foreignKey: { allowNull: false } }
  const primaryKey = { foreignKey: { allowNull: false, primaryKey: true } }


  //////////////////////////////////////////////////////////////////

  const Language = connection.define('language', Object.assign({
    id: {
      type: Sequelize.STRING(3),
      primaryKey: true,
      validate: {
        is: languageIdRegEx,
      },
    },
    name: {
      type: Sequelize.STRING(100),
      unique: 'name',
      allowNull: false,
    },
    englishName: {
      type: Sequelize.STRING(100),
      unique: 'englishName',
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  ////////////////////////////////////////////////////////////////////

  const Definition = connection.define('definition', Object.assign({
    id: {
      type: Sequelize.STRING(11),
      primaryKey: true,
      validate: {
        is: definitionIdRegEx,
      },
    },
    lex: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    lexUnique: {  // i.e. Is the lexeme's form unique?
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    vocal: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    hits,
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
        fields: ['lex'],
      },
      {
        fields: ['lexUnique'],
      },
      {
        fields: ['hits'],
      },
    ],
  }, noTimestampsOptions))

  ////////////////////////////////////////////////////////////////////

  const DefinitionByLanguage = connection.define('definitionByLanguage', Object.assign({
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
    lexEntry: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isLexEntry,
      },
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['gloss'],
      },
      {
        fields: ['definitionId'],
      },
      {
        fields: ['languageId'],
      },
    ],
  }, noTimestampsOptions))

  Language.belongsToMany(Definition, { through: DefinitionByLanguage })
  Definition.belongsToMany(Language, { through: DefinitionByLanguage })

  //////////////////////////////////////////////////////////////////

  const PartOfSpeech = connection.define('partOfSpeech', Object.assign({
    pos: {
      type: Sequelize.ENUM('A', 'C', 'D', 'N', 'P', 'R', 'T', 'V', 'E', 'I'),
      // Note: these part-of-speech codes mean different things depending
      // on whether they are Hebrew or Greek. But we leave it to the widget
      // to worry about this.
      primaryKey: true,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['pos'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  PartOfSpeech.belongsTo(Definition, primaryKey)
  Definition.hasMany(PartOfSpeech)

  //////////////////////////////////////////////////////////////////

  const Version = connection.define('version', Object.assign({
    id: {
      type: Sequelize.STRING(9),
      primaryKey: true,
      validate: {
        is: versionIdRegEx,
      },
    },
    name: {
      type: Sequelize.STRING(150),
      unique: 'name',
      allowNull: false,
      notEmpty: true,
    },
    wordDividerRegex: {
      type: Sequelize.STRING(100),
    },
    partialScope: {  // typically nt, ot, or null; null indicates this version covers the entire (canonical) Bible
      type: Sequelize.STRING(2),
      validate: {
        is: scopeRegEx,
      },
    },
    versificationModel: {
      type: Sequelize.ENUM('original', 'kjv', 'synodal', 'lxx'),
      allowNull: false,
    },
    skipsUnlikelyOriginals: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    extraVerseMappings: {
      type: Sequelize.JSON,
      validate: {
        isVerseMappings,
      },
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['partialScope'],
      },
      {
        fields: ['versificationModel'],
      },
      {
        fields: ['skipsUnlikelyOriginals'],
      },
      {
        fields: ['languageId'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  Version.belongsTo(Language, required)
  Language.hasMany(Version)

  //////////////////////////////////////////////////////////////////

  const EmbeddingApp = connection.define('embeddingApp', Object.assign({
    // will need a default row (id=1) where uri=import
    uri: {
      type: Sequelize.STRING(255),
      unique: 'uri',
      allowNull: false,
    },
    notes: {
      type: Sequelize.TEXT,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['uri'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  //////////////////////////////////////////////////////////////////

  const User = connection.define('user', Object.assign({
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    google: {
      type: Sequelize.STRING(50),
    },
    facebook: {
      type: Sequelize.STRING(50),
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ratingHistory: {  // each adjustment (with description) on a separate line
      type: Sequelize.TEXT,
      allowNull: false,
    },
    flaggedForAbuse: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    notes: {
      type: Sequelize.TEXT,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['google'],
      },
      {
        fields: ['facebook'],
      },
      {
        fields: ['rating'],
      },
      {
        fields: ['flaggedForAbuse'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  //////////////////////////////////////////////////////////////////

  const UserRatingAdjustment = connection.define('userRatingAdjustment', Object.assign({
    adjustment: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    notes: {
      type: Sequelize.TEXT,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['adjustment'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  UserRatingAdjustment.belongsTo(User, required)
  User.hasMany(UserRatingAdjustment)

  //////////////////////////////////////////////////////////////////

  // Built off the assumption that alternative lemma or morphological
  // interpretations will NOT be considered in search. However, this
  // does not mean that such things could not be indicated as footnotes
  // in the text.

  const uhbWord = connection.define('uhbWord', Object.assign({
    id: wordId,
    bookId,
    chapter,
    verse,
    wordNumber,
    verseNumber,
    sectionNumber: {  // sections separated by ס or פ (or chapter?)
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    nakedWord,
    lemma,
    isAramaic: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    b: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    l: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    k: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    m: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    sh: {  // ש
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    v: {  // ו
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    h1: {  // definite article
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    h2: {  // inseparable definite article in preposition
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    h3: {  // interrogative particle
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    pos: {
      type: Sequelize.ENUM('A', 'C', 'D', 'N', 'P', 'R', 'T', 'V'),
      allowNull: false,
    },
    stem: {  // includes the language to remove ambiguity
      type: Sequelize.ENUM(
        'Hq', 'HN', 'Hp', 'HP', 'Hh', 'HH', 'Ht', 'Ho',
        'HO', 'Hr', 'Hm', 'HM', 'Hk', 'HK', 'HQ', 'Hl',
        'HL', 'Hf', 'HD', 'Hj', 'Hi', 'Hu', 'Hc', 'Hv',
        'Hw', 'Hy', 'Hz', 'Aq', 'AQ', 'Au', 'AN', 'Ap',
        'AP', 'AM', 'Aa', 'Ah', 'As', 'Ae', 'AH', 'Ai',
        'At', 'Av', 'Aw', 'Ao', 'Az', 'Ar', 'Af', 'Ab',
        'Ac', 'Am', 'Al', 'AL', 'AO', 'AG'
      ),
    },
    aspect: {
      type: Sequelize.ENUM('p', 'q', 'i', 'w', 'h', 'j', 'v', 'r', 's', 'a', 'c'),
    },
    type: {  // includes the pos to remove ambiguity
      type: Sequelize.ENUM(
        'Ac', 'Ao', 'Ng', 'Np', 'Pd', 'Pf', 'Pi', 'Pp',
        'Pr', 'Rd', 'Ta', 'Td', 'Te', 'Ti', 'Tj', 'Tm',
        'Tn', 'To', 'Tr'
      ),
    },
    person: {
      type: Sequelize.ENUM('1', '2', '3'),
    },
    gender: {
      type: Sequelize.ENUM('m', 'f', 'b', 'c'),
    },
    number: {
      type: Sequelize.ENUM('s', 'p', 'd'),
    },
    state: {
      type: Sequelize.ENUM('a', 'c', 'd'),
    },
    h4: {  // directional ה
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    h5: {  // paragogic ה
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    n: {  // paragogic ן
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    suffixPerson: {
      type: Sequelize.ENUM('1', '2', '3'),
    },
    suffixGender: {
      type: Sequelize.ENUM('m', 'f', 'c'),
    },
    suffixNumber: {
      type: Sequelize.ENUM('s', 'p'),
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
        fields: ['wordNumber'],
      },
      {
        fields: ['verseNumber'],
      },
      {
        fields: ['sectionNumber'],
      },
      {
        fields: ['nakedWord'],
      },
      {
        fields: ['isAramaic'],
      },
      {
        fields: ['b'],
      },
      {
        fields: ['l'],
      },
      {
        fields: ['k'],
      },
      {
        fields: ['m'],
      },
      {
        fields: ['sh'],
      },
      {
        fields: ['v'],
      },
      {
        fields: ['h1'],
      },
      {
        fields: ['h2'],
      },
      {
        fields: ['h3'],
      },
      {
        fields: ['pos'],
      },
      {
        fields: ['stem'],
      },
      {
        fields: ['aspect'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['person'],
      },
      {
        fields: ['gender'],
      },
      {
        fields: ['number'],
      },
      {
        fields: ['state'],
      },
      {
        fields: ['h4'],
      },
      {
        fields: ['h5'],
      },
      {
        fields: ['n'],
      },
      {
        fields: ['suffixPerson'],
      },
      {
        fields: ['suffixGender'],
      },
      {
        fields: ['suffixNumber'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  uhbWord.belongsTo(Definition, required)
  Definition.hasMany(uhbWord)

  //////////////////////////////////////////////////////////////////

  const uhbVerse = connection.define('uhbVerse', Object.assign({
    id: { ...verseId },
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const uhbTagSet = connection.define('uhbTagSet', Object.assign({
    verseId,
    tags: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['verseId'],
      },
      {
        fields: ['versionId'],
      },
    ],
  }, noTimestampsOptions))

  uhbTagSet.belongsTo(Version, primaryKey)
  Version.hasMany(uhbTagSet)

  //////////////////////////////////////////////////////////////////

  const uhbTag = connection.define('uhbTag', Object.assign({
    wordPartNumber: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    translationWordNumberInVerse: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    type,
  }), Object.assign({
    indexes: [
      {
        fields: ['versionId'],
      },
      {
        fields: ['uhbWordId'],
      },
      {
        fields: ['wordPartNumber'],
      },
      {
        fields: ['translationWordNumberInVerse'],
      },
      {
        fields: ['type'],
      },
    ],
  }, noTimestampsOptions))

  uhbTag.belongsTo(Version, primaryKey)
  Version.hasMany(uhbTag)

  uhbTag.belongsTo(uhbWord, primaryKey)
  uhbWord.hasMany(uhbTag)

  //////////////////////////////////////////////////////////////////

  const uhbTagSubmission = connection.define('uhbTagSubmission', Object.assign({
    wordPartNumber: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    translationWordNumberInVerse: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['versionId'],
      },
      {
        fields: ['uhbWordId'],
      },
      {
        fields: ['wordPartNumber'],
      },
      {
        fields: ['translationWordNumberInVerse'],
      },
      {
        fields: ['embeddingAppId'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  uhbTagSubmission.belongsTo(User, primaryKey)
  User.hasMany(uhbTagSubmission)

  uhbTagSubmission.belongsTo(Version, primaryKey)
  Version.hasMany(uhbTagSubmission)

  uhbTagSubmission.belongsTo(uhbWord, primaryKey)
  uhbWord.hasMany(uhbTagSubmission)

  uhbTagSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(uhbTagSubmission)

  User.belongsToMany(EmbeddingApp, { through: { model: uhbTagSubmission, unique: false } })
  EmbeddingApp.belongsToMany(User, { through: { model: uhbTagSubmission, unique: false } })

  //////////////////////////////////////////////////////////////////

  const ugntWord = connection.define('ugntWord', Object.assign({
    bookId,
    chapter,
    verse,
    wordNumber,
    verseNumber,
    phraseNumber: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sentenceNumber: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    paragraphNumber: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    nakedWord,
    lemma,
    pos: greekPos,
    type: greekType,
    mood: greekMood,
    aspect: greekAspect,
    voice: greekVoice,
    person: greekPerson,
    case: greekCase,
    gender: greekGender,
    number: greekNumber,
    attribute: greekAttribute,
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
        fields: ['wordNumber'],
      },
      {
        fields: ['verseNumber'],
      },
      {
        fields: ['phraseNumber'],
      },
      {
        fields: ['sentenceNumber'],
      },
      {
        fields: ['paragraphNumber'],
      },
      {
        fields: ['nakedWord'],
      },
      {
        fields: ['pos'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['mood'],
      },
      {
        fields: ['aspect'],
      },
      {
        fields: ['voice'],
      },
      {
        fields: ['person'],
      },
      {
        fields: ['case'],
      },
      {
        fields: ['gender'],
      },
      {
        fields: ['number'],
      },
      {
        fields: ['attribute'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  ugntWord.belongsTo(Definition, required)
  Definition.hasMany(ugntWord)

  //////////////////////////////////////////////////////////////////

  const ugntVerse = connection.define('ugntVerse', Object.assign({
    id: { ...verseId },
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const ugntTagSet = connection.define('ugntTagSet', Object.assign({
    verseId,
    tags: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['verseId'],
      },
      {
        fields: ['versionId'],
      },
    ],
  }, noTimestampsOptions))

  ugntTagSet.belongsTo(Version, primaryKey)
  Version.hasMany(ugntTagSet)

  //////////////////////////////////////////////////////////////////

  const ugntTag = connection.define('ugntTag', Object.assign({
    translationWordNumberInVerse: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    type,
  }), Object.assign({
    indexes: [
      {
        fields: ['versionId'],
      },
      {
        fields: ['ugntWordId'],
      },
      {
        fields: ['translationWordNumberInVerse'],
      },
      {
        fields: ['type'],
      },
    ],
  }, noTimestampsOptions))

  ugntTag.belongsTo(Version, primaryKey)
  Version.hasMany(ugntTag)

  ugntTag.belongsTo(ugntWord, primaryKey)
  ugntWord.hasMany(ugntTag)

  //////////////////////////////////////////////////////////////////

  const ugntTagSubmission = connection.define('ugntTagSubmission', Object.assign({
    translationWordNumberInVerse: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['versionId'],
      },
      {
        fields: ['ugntWordId'],
      },
      {
        fields: ['translationWordNumberInVerse'],
      },
      {
        fields: ['embeddingAppId'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  ugntTagSubmission.belongsTo(User, primaryKey)
  User.hasMany(ugntTagSubmission)

  ugntTagSubmission.belongsTo(Version, primaryKey)
  Version.hasMany(ugntTagSubmission)

  ugntTagSubmission.belongsTo(ugntWord, primaryKey)
  ugntWord.hasMany(ugntTagSubmission)

  ugntTagSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(ugntTagSubmission)

  User.belongsToMany(EmbeddingApp, { through: { model: ugntTagSubmission, unique: false } })
  EmbeddingApp.belongsToMany(User, { through: { model: ugntTagSubmission, unique: false } })

  //////////////////////////////////////////////////////////////////

  const lxxWord = connection.define('lxxWord', Object.assign({
    bookId,
    // Includes deuterocanonical books, though these are not included
    // in default Bible Tags searches, nor in statistics.
    chapter,
    verse,
    wordNumber,
    verseNumber,
    nakedWord,
    lemma,
    pos: greekPos,
    type: greekType,
    mood: greekMood,
    aspect: greekAspect,
    voice: greekVoice,
    person: greekPerson,
    case: greekCase,
    gender: greekGender,
    number: greekNumber,
    attribute: greekAttribute,
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
        fields: ['wordNumber'],
      },
      {
        fields: ['verseNumber'],
      },
      {
        fields: ['nakedWord'],
      },
      {
        fields: ['pos'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['mood'],
      },
      {
        fields: ['aspect'],
      },
      {
        fields: ['voice'],
      },
      {
        fields: ['person'],
      },
      {
        fields: ['case'],
      },
      {
        fields: ['gender'],
      },
      {
        fields: ['number'],
      },
      {
        fields: ['attribute'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  lxxWord.belongsTo(Definition, required)
  Definition.hasMany(lxxWord)

  //////////////////////////////////////////////////////////////////

  const lxxVerse = connection.define('lxxVerse', Object.assign({
    id: { ...verseId },
    // Includes deuterocanonical books, though these are not included
    // in default Bible Tags searches, nor in statistics.
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const WordTranslation = connection.define('wordTranslation', Object.assign({
    translation: {
      type: Sequelize.STRING(200),  // TODO: when inserting to this, make sure the translation string is not too long.
      primaryKey: true,
      notEmpty: true,
    },
    hits,
  }), Object.assign({
    indexes: [
      {
        fields: ['translation'],
      },
      {
        fields: ['definitionId'],
      },
      {
        fields: ['versionId'],
      },
      {
        fields: ['hits'],
      },
    ],
  }, noTimestampsOptions))

  WordTranslation.belongsTo(Definition, primaryKey)
  Definition.hasMany(WordTranslation)

  WordTranslation.belongsTo(Version, primaryKey)
  Version.hasMany(WordTranslation)

  //////////////////////////////////////////////////////////////////

  const HitsByScope = connection.define('hitsByScope', Object.assign({
    scope,
    hits,
  }), Object.assign({
    indexes: [
      {
        fields: ['hits'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  HitsByScope.belongsTo(Definition, primaryKey)
  Definition.hasMany(HitsByScope)

  //////////////////////////////////////////////////////////////////

  const HitsByForm = connection.define('hitsByForm', Object.assign({
    form: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    hits,
  }), Object.assign({
    indexes: [
      {
        fields: ['hits'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  HitsByForm.belongsTo(Definition, primaryKey)
  Definition.hasMany(HitsByForm)

  //////////////////////////////////////////////////////////////////

  const HitsInLXXByScope = connection.define('hitsInLXXByScope', Object.assign({
    scope,
    hits,
  }), Object.assign({
    indexes: [
      {
        fields: ['hits'],
      },
      {
        fields: ['definitionId'],
      },
    ],
  }, noTimestampsOptions))

  HitsInLXXByScope.belongsTo(Definition, primaryKey)
  Definition.hasMany(HitsInLXXByScope)

  //////////////////////////////////////////////////////////////////

  const UiEnglishWord = connection.define('uiEnglishWord', Object.assign({
    str: {
      type: Sequelize.STRING(255),
      unique: 'str-desc',
      allowNull: false,
      notEmpty: true,
    },
    desc: {
      type: Sequelize.STRING(255),
      unique: 'str-desc',
      notEmpty: true,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['str'],
      },
      {
        fields: ['desc'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  //////////////////////////////////////////////////////////////////

  const UiWord = connection.define('uiWord', Object.assign({
    translation: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    uiEnglishWordId: {
      // One primaryKey column needs to be listed here to prevent sequelize
      // from creating an id column.
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['translation'],
      },
      {
        fields: ['uiEnglishWordId'],
      },
      {
        fields: ['languageId'],
      },
    ],
  }, noTimestampsOptions))

  UiWord.belongsTo(UiEnglishWord, primaryKey)
  UiEnglishWord.hasMany(UiWord)

  UiWord.belongsTo(Language, primaryKey)
  Language.hasMany(UiWord)

  //////////////////////////////////////////////////////////////////

  const UiWordSubmission = connection.define('uiWordSubmission', Object.assign({
    translation: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    uiEnglishWordId: {
      // One primaryKey column needs to be listed here to prevent sequelize
      // from creating an id column.
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['uiEnglishWordId'],
      },
      {
        fields: ['languageId'],
      },
      {
        fields: ['embeddingAppId'],
      },
      {
        fields: ['translation'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['updatedAt'],
      },
    ],
  }))

  UiWordSubmission.belongsTo(User, primaryKey)
  User.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(UiEnglishWord, primaryKey)
  UiEnglishWord.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(Language, primaryKey)
  Language.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(UiWordSubmission)

  User.belongsToMany(EmbeddingApp, { through: { model: UiWordSubmission, unique: false } })
  EmbeddingApp.belongsToMany(User, { through: { model: UiWordSubmission, unique: false } })

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  createConnection,
  nullLikeDate,
}
