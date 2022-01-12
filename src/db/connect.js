const Sequelize = require('sequelize')
const retry = require('retry-as-promised')

const {
  wordIdRegEx,
  locRegEx,
  versionIdRegEx,
  definitionIdRegEx,
  languageIdRegEx,
  scopeRegEx,
  translationLength,
  translationWordLength,
  languageNameLength,
  glossLength,
  versionNameLength,
  wordsHashLength,
  wordsHashRegEx,
} = require('../constants')

const MAX_CONNECTION_AGE = 1000 * 60 * 60 * 7.5

const connectionObj = {
  host: process.env.RDS_HOST || 'localhost',
  user: process.env.RDS_USERNAME || 'root',
  password: process.env.RDS_PASSWORD || '',
  database: process.env.RDS_DB_NAME || 'BibleTags',
  port: process.env.RDS_PORT || '3306',
}

const setUpConnection = ({
  setUpCascadeDeletes=false,
}={}) => {

  global.connection = new Sequelize(
    connectionObj.database,
    connectionObj.user,
    connectionObj.password,
    {
      dialect: 'mysql',
      dialectOptions: {
        multipleStatements: true,
      },
      host: connectionObj.host,
      port: connectionObj.port,
      logging: (query, msEllapsed) => (
        msEllapsed > 1000 ? console.log(`WARNING: Slow query (${msEllapsed/1000} seconds). ${query}`) : null
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
            console.log("WARNING: Database connection being marked invalid.", obj.connectionId)
          }
          return isValid
        },
        max: 100,
      },
    }
  )

  global.connection.transactionWithRetry = operationsFunc => (
    retry(
      () => global.connection.transaction(operationsFunc),
      {
        max: 3,
        match: [/Deadlock/i],
      },
    )
  )

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

  const createdAt = {
    type: Sequelize.DATE(3),
    allowNull: false,
    defaultValue: Sequelize.NOW,
  }

  const updatedAt = {
    type: Sequelize.DATE(3),
    allowNull: false,
  }

  const loc = {
    type: Sequelize.STRING(8),
    primaryKey: true,
    validate: {
      is: locRegEx,
    },
  }

  const wordsHash = {
    // eg. "i8eeWqiuDiufAA" for a seven-word verse (2 letters per word)
    // Effectively works to distiguish verses which differ due to being
    // from two different editions of a single Bible version.
    type: Sequelize.STRING(wordsHashLength),
    primaryKey: true,
    validate: {
      is: wordsHashRegEx,
    },
  }

  const wordComboHash = {
    type: Sequelize.STRING(24),
    allowNull: false,
    notEmpty: true,
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
    notEmpty: true,
  }

  const lemma = {
    type: Sequelize.STRING(50),
    allowNull: false,
    notEmpty: true,
  }

  const fullParsing = {
    type: Sequelize.STRING(30),
    allowNull: false,
    notEmpty: true,
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
    type: Sequelize.ENUM('N', 'A', 'E', 'R', 'V', 'I', 'P', 'D', 'C', 'T', 'F'),  // F is for foreign
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

  // const createdAtDesc = { attribute: 'createdAt', order: 'DESC' }
  // const updatedAtDesc = { attribute: 'updatedAt', order: 'DESC' }

  const required = { foreignKey: { allowNull: false } }
  const onDeleteAddition = setUpCascadeDeletes ? { onDelete: 'CASCADE' } : {}
  const requiredWithCascadeDelete = { foreignKey: { allowNull: false }, ...onDeleteAddition }
  const primaryKey = { foreignKey: { allowNull: false, primaryKey: true } }
  const unique = unique => ({ foreignKey: { allowNull: false, unique } })

  //////////////////////////////////////////////////////////////////

  const Language = connection.define(
    'language',
    {
      id: {
        type: Sequelize.STRING(3),
        primaryKey: true,
        validate: {
          is: languageIdRegEx,
        },
      },
      name: {
        type: Sequelize.STRING(languageNameLength),
        allowNull: false,
      },
      englishName: {
        type: Sequelize.STRING(languageNameLength),
        allowNull: false,
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        {
          fields: ['name'],
          unique: true,
          name: 'name',
        },
        {
          fields: ['englishName'],
          unique: true,
          name: 'englishName',
        },
      ],
    },
  )

  ////////////////////////////////////////////////////////////////////

  const Definition = connection.define(
    'definition',
    {
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
    },
    {
      indexes: [
        { fields: ['lex'] },
        { fields: ['lexUnique'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  ////////////////////////////////////////////////////////////////////

  const DefinitionByLanguage = connection.define(
    'definitionByLanguage',
    {
      gloss: {
        type: Sequelize.STRING(glossLength),
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
    },
    {
      indexes: [
        { fields: ['gloss'] },
        { fields: ['definitionId'] },
        { fields: ['languageId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  Language.belongsToMany(Definition, { through: DefinitionByLanguage })
  Definition.belongsToMany(Language, { through: DefinitionByLanguage })

  //////////////////////////////////////////////////////////////////

  const PartOfSpeech = connection.define(
    'partOfSpeech',
    {
      pos: {
        type: Sequelize.ENUM('A', 'C', 'D', 'N', 'P', 'R', 'T', 'V', 'E', 'I', 'F'),
        // Note: these part-of-speech codes mean different things depending
        // on whether they are Hebrew or Greek. But we leave it to the widget
        // to worry about this. Also, see biblearc-widget's getNormalizedGreekPOSCode
        // function for importing the Greek for this table properly.
        primaryKey: true,
      },
    },
    {
      indexes: [
        { fields: ['pos'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  PartOfSpeech.belongsTo(Definition, primaryKey)
  Definition.hasMany(PartOfSpeech)

  //////////////////////////////////////////////////////////////////

  const Version = connection.define(
    'version',
    {
      id: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        validate: {
          is: versionIdRegEx,
        },
      },
      name: {
        type: Sequelize.STRING(versionNameLength),
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
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['partialScope'] },
        { fields: ['versificationModel'] },
        { fields: ['skipsUnlikelyOriginals'] },
        { fields: ['languageId'] },
      ],
    },
  )

  Version.belongsTo(Language, required)
  Language.hasMany(Version)

  //////////////////////////////////////////////////////////////////

  const EmbeddingApp = connection.define(
    'embeddingApp',
    {
      // will need a default row (id=1) where uri=import
      uri: {
        type: Sequelize.STRING(255),
        unique: 'uri',
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['uri'] },
      ],
    },
  )

  //////////////////////////////////////////////////////////////////

  const User = connection.define(
    'user',
    {
      email: {  // for non-authenticated users: [uuid]@bibletags.org
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: 'email',
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
        defaultValue: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['google'] },
        { fields: ['facebook'] },
        { fields: ['rating'] },
        { fields: ['flaggedForAbuse'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  //////////////////////////////////////////////////////////////////

  const UserEmbeddingApp = connection.define(
    'userEmbeddingApp',
    {
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['userId'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  User.belongsToMany(EmbeddingApp, { through: UserEmbeddingApp })
  EmbeddingApp.belongsToMany(User, { through: UserEmbeddingApp })

  //////////////////////////////////////////////////////////////////

  const UserRatingAdjustment = connection.define(
    'userRatingAdjustment',
    {
      adjustment: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['adjustment'] },
        { fields: ['userId'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  UserRatingAdjustment.belongsTo(User, requiredWithCascadeDelete)
  User.hasMany(UserRatingAdjustment)

  //////////////////////////////////////////////////////////////////

  const TagSet = connection.define(
    'tagSet',
    {
      loc,
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'incomplete',
          'unconfirmed',
          'confirmed'
        ),
        allowNull: false,
      },
      wordsHash,
    },
    {
      indexes: [
        { fields: ['loc'] },
        { fields: ['versionId'] },
        { fields: ['loc', 'versionId'] },
        { fields: ['wordsHash'] },
        { fields: ['status'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  TagSet.belongsTo(Version, primaryKey)
  Version.hasMany(TagSet)

  //////////////////////////////////////////////////////////////////

  const TagSetSubmission = connection.define(
    'tagSetSubmission',
    {
      loc: {
        type: Sequelize.STRING(8),
        unique: 'userId-versionId-loc-wordsHash',
        validate: {
          is: locRegEx,
        },
      },
      wordsHash: {  // See the notes on wordsHash column above.
        type: Sequelize.STRING(wordsHashLength),
        unique: 'userId-versionId-loc-wordsHash',
        allowNull: false,
        validate: {
          is: wordsHashRegEx,
        },
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['userId'] },
        { fields: ['versionId'] },
        { fields: ['loc'] },
        { fields: ['wordsHash'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  TagSetSubmission.belongsTo(User, unique('userId-versionId-loc-wordsHash'))
  User.hasMany(TagSetSubmission)

  TagSetSubmission.belongsTo(Version, unique('userId-versionId-loc-wordsHash'))
  Version.hasMany(TagSetSubmission)

  TagSetSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(TagSetSubmission)

  //////////////////////////////////////////////////////////////////

  const WordHashesSetSubmission = connection.define(
    'wordHashesSetSubmission',
    {
      loc: {
        type: Sequelize.STRING(8),
        unique: 'versionId-loc-wordsHash',
        validate: {
          is: locRegEx,
        },
      },
      wordsHash: {  // See the notes on wordsHash column above.
        type: Sequelize.STRING(wordsHashLength),
        unique: 'versionId-loc-wordsHash',
        allowNull: false,
        validate: {
          is: wordsHashRegEx,
        },
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['versionId'] },
        { fields: ['loc'] },
        { fields: ['wordsHash'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  WordHashesSetSubmission.belongsTo(Version, unique('versionId-loc-wordsHash'))
  Version.hasMany(WordHashesSetSubmission)

  WordHashesSetSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(WordHashesSetSubmission)

  //////////////////////////////////////////////////////////////////

  const WordHashesSubmission = connection.define(
    'wordHashesSubmission',
    {
      wordNumberInVerse: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      hash: { ...wordComboHash },
      withBeforeHash: { ...wordComboHash },
      withAfterHash: { ...wordComboHash },
      withBeforeAndAfterHash: { ...wordComboHash },
    },
    {
      indexes: [
        { fields: ['wordNumberInVerse'] },
        { fields: ['hash'] },
        { fields: ['withBeforeHash'] },
        { fields: ['withAfterHash'] },
        { fields: ['withBeforeAndAfterHash'] },
        { fields: ['wordHashesSetSubmissionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  WordHashesSubmission.belongsTo(WordHashesSetSubmission, primaryKey)
  WordHashesSetSubmission.hasMany(WordHashesSubmission)

  //////////////////////////////////////////////////////////////////

  // Built off the assumption that alternative lemma or morphological
  // interpretations will NOT be considered in search. However, this
  // does not mean that such things could not be indicated as footnotes
  // in the text.

  const uhbWord = connection.define(
    'uhbWord',
    {
      id: {
        type: Sequelize.STRING(5),
        primaryKey: true,
        validate: {
          is: wordIdRegEx,
        },
      },
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
      fullParsing,  // prefixes + parsing string
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
    },
    {
      indexes: [
        { fields: ['bookId'] },
        { fields: ['chapter'] },
        { fields: ['verse'] },
        { fields: ['wordNumber'] },
        { fields: ['verseNumber'] },
        { fields: ['sectionNumber'] },
        { fields: ['nakedWord'] },
        { fields: ['lemma'] },
        { fields: ['fullParsing'] },
        { fields: ['isAramaic'] },
        { fields: ['b'] },
        { fields: ['l'] },
        { fields: ['k'] },
        { fields: ['m'] },
        { fields: ['sh'] },
        { fields: ['v'] },
        { fields: ['h1'] },
        { fields: ['h2'] },
        { fields: ['h3'] },
        { fields: ['pos'] },
        { fields: ['stem'] },
        { fields: ['aspect'] },
        { fields: ['type'] },
        { fields: ['person'] },
        { fields: ['gender'] },
        { fields: ['number'] },
        { fields: ['state'] },
        { fields: ['h4'] },
        { fields: ['h5'] },
        { fields: ['n'] },
        { fields: ['suffixPerson'] },
        { fields: ['suffixGender'] },
        { fields: ['suffixNumber'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  uhbWord.belongsTo(Definition)
  Definition.hasMany(uhbWord)

  //////////////////////////////////////////////////////////////////

  const uhbVerse = connection.define(
    'uhbVerse',
    {
      loc: {
        type: Sequelize.STRING(8),
        primaryKey: true,
        validate: {
          is: locRegEx,
        },
      },
      usfm,
    },
    {
      indexes: [
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  const uhbTag = connection.define(
    'uhbTag',
    {
      wordPartNumber: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      translationWordNumberInVerse: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      wordsHash,
      type,
    },
    {
      indexes: [
        { fields: ['versionId'] },
        { fields: ['uhbWordId'] },
        { fields: ['wordPartNumber'] },
        { fields: ['translationWordNumberInVerse'] },
        { fields: ['wordsHash'] },
        { fields: ['type'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  uhbTag.belongsTo(Version, primaryKey)
  Version.hasMany(uhbTag)

  uhbTag.belongsTo(uhbWord, primaryKey)
  uhbWord.hasMany(uhbTag)

  //////////////////////////////////////////////////////////////////

  const uhbTagSubmission = connection.define(
    'uhbTagSubmission',
    {
      wordPartNumber: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      translationWordNumberInVerse: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      translationWord: {
        type: Sequelize.STRING(translationWordLength),
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [
        { fields: ['tagSetSubmissionId'] },
        { fields: ['uhbWordId'] },
        { fields: ['wordPartNumber'] },
        { fields: ['translationWordNumberInVerse'] },
        { fields: ['translationWord'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  uhbTagSubmission.belongsTo(TagSetSubmission, primaryKey)
  TagSetSubmission.hasMany(uhbTagSubmission)

  uhbTagSubmission.belongsTo(uhbWord, primaryKey)
  uhbWord.hasMany(uhbTagSubmission)

  //////////////////////////////////////////////////////////////////

  const ugntWord = connection.define(
    'ugntWord',
    {
      id: {
        type: Sequelize.STRING(5),
        primaryKey: true,
        validate: {
          is: wordIdRegEx,
        },
      },
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
      fullParsing,
      pos: greekPos,  // Different than UGNT's pos for a few types. Eg. NS (substantive adjective) is considered an adjective
      morphPos: {  // UGNT's pos
        type: Sequelize.ENUM('N', 'A', 'E', 'R', 'V', 'I', 'P', 'D', 'C', 'T'),
        allowNull: false,
      },
      type: greekType,
      mood: greekMood,
      aspect: greekAspect,
      voice: greekVoice,
      person: greekPerson,
      case: greekCase,
      gender: greekGender,
      number: greekNumber,
      attribute: greekAttribute,
    },
    {
      indexes: [
        { fields: ['bookId'] },
        { fields: ['chapter'] },
        { fields: ['verse'] },
        { fields: ['wordNumber'] },
        { fields: ['verseNumber'] },
        { fields: ['phraseNumber'] },
        { fields: ['sentenceNumber'] },
        { fields: ['paragraphNumber'] },
        { fields: ['nakedWord'] },
        { fields: ['lemma'] },
        { fields: ['fullParsing'] },
        { fields: ['pos'] },
        { fields: ['morphPos'] },
        { fields: ['type'] },
        { fields: ['mood'] },
        { fields: ['aspect'] },
        { fields: ['voice'] },
        { fields: ['person'] },
        { fields: ['case'] },
        { fields: ['gender'] },
        { fields: ['number'] },
        { fields: ['attribute'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  ugntWord.belongsTo(Definition, required)
  Definition.hasMany(ugntWord)

  //////////////////////////////////////////////////////////////////

  const ugntVerse = connection.define(
    'ugntVerse',
    {
      loc: {
        type: Sequelize.STRING(8),
        primaryKey: true,
        validate: {
          is: locRegEx,
        },
      },
      usfm,
    },
    {
      indexes: [
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  const ugntTag = connection.define(
    'ugntTag',
    {
      translationWordNumberInVerse: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      wordsHash,
      type,
    },
    {
      indexes: [
        { fields: ['versionId'] },
        { fields: ['ugntWordId'] },
        { fields: ['translationWordNumberInVerse'] },
        { fields: ['wordsHash'] },
        { fields: ['type'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  ugntTag.belongsTo(Version, primaryKey)
  Version.hasMany(ugntTag)

  ugntTag.belongsTo(ugntWord, primaryKey)
  ugntWord.hasMany(ugntTag)

  //////////////////////////////////////////////////////////////////

  const ugntTagSubmission = connection.define(
    'ugntTagSubmission',
    {
      translationWordNumberInVerse: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      translationWord: {
        type: Sequelize.STRING(translationWordLength),
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [
        { fields: ['tagSetSubmissionId'] },
        { fields: ['ugntWordId'] },
        { fields: ['translationWordNumberInVerse'] },
        { fields: ['translationWord'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  ugntTagSubmission.belongsTo(TagSetSubmission, primaryKey)
  TagSetSubmission.hasMany(ugntTagSubmission)

  ugntTagSubmission.belongsTo(ugntWord, primaryKey)
  ugntWord.hasMany(ugntTagSubmission)
  
  //////////////////////////////////////////////////////////////////

  const lxxWord = connection.define(
    'lxxWord',
    {
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
    },
    {
      indexes: [
        { fields: ['bookId'] },
        { fields: ['chapter'] },
        { fields: ['verse'] },
        { fields: ['wordNumber'] },
        { fields: ['verseNumber'] },
        { fields: ['nakedWord'] },
        { fields: ['pos'] },
        { fields: ['type'] },
        { fields: ['mood'] },
        { fields: ['aspect'] },
        { fields: ['voice'] },
        { fields: ['person'] },
        { fields: ['case'] },
        { fields: ['gender'] },
        { fields: ['number'] },
        { fields: ['attribute'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  lxxWord.belongsTo(Definition, required)
  Definition.hasMany(lxxWord)

  //////////////////////////////////////////////////////////////////

  const lxxVerse = connection.define(
    'lxxVerse',
    {
      loc: {
        type: Sequelize.STRING(8),
        primaryKey: true,
        validate: {
          is: locRegEx,
        },
      },
      // Includes deuterocanonical books, though these are not included
      // in default Bible Tags searches, nor in statistics.
      usfm,
    },
    {
      indexes: [
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  const WordTranslation = connection.define(
    'wordTranslation',
    {
      translation: {
        type: Sequelize.STRING(translationLength),
        primaryKey: true,
        notEmpty: true,
      },
      hits,
      // The number of hits might exceed the number of [non-variant] instances of this word
      // for two different reasons. (1) If there is a translation from a variant. (2) If
      // the version has more than a single edition.
    },
    {
      indexes: [
        { fields: ['translation'] },
        { fields: ['definitionId'] },
        { fields: ['versionId'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  WordTranslation.belongsTo(Definition, primaryKey)
  Definition.hasMany(WordTranslation)

  WordTranslation.belongsTo(Version, primaryKey)
  Version.hasMany(WordTranslation)

  //////////////////////////////////////////////////////////////////

  const HitsByScope = connection.define(
    'hitsByScope',
    {
      scope,
      hits,
    },
    {
      indexes: [
        { fields: ['hits'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  HitsByScope.belongsTo(Definition, primaryKey)
  Definition.hasMany(HitsByScope)

  //////////////////////////////////////////////////////////////////

  const HitsByForm = connection.define(
    'hitsByForm',
    {
      form: {
        type: Sequelize.STRING(30),
        primaryKey: true,
      },
      hits,
    },
    {
      indexes: [
        { fields: ['hits'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  HitsByForm.belongsTo(Definition, primaryKey)
  Definition.hasMany(HitsByForm)

  //////////////////////////////////////////////////////////////////

  const HitsInLXXByScope = connection.define(
    'hitsInLXXByScope',
    {
      scope,
      hits,
    },
    {
      indexes: [
        { fields: ['hits'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  HitsInLXXByScope.belongsTo(Definition, primaryKey)
  Definition.hasMany(HitsInLXXByScope)

  //////////////////////////////////////////////////////////////////

  const UiEnglishWord = connection.define(
    'uiEnglishWord',
    {
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
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['str'] },
        { fields: ['desc'] },
      ],
    },
  )

  //////////////////////////////////////////////////////////////////

  const UiWord = connection.define(
    'uiWord',
    {
      translation: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ['translation'] },
        { fields: ['uiEnglishWordId'] },
        { fields: ['languageId'] },
      ],
      timestamps: false,  // Used in tables which can be completed derived from other tables and base import files.
    },
  )

  UiWord.belongsTo(UiEnglishWord, unique('uiEnglishWordId-languageId'))
  UiEnglishWord.hasMany(UiWord)

  UiWord.belongsTo(Language, unique('uiEnglishWordId-languageId'))
  Language.hasMany(UiWord)

  //////////////////////////////////////////////////////////////////

  const UiWordSubmission = connection.define(
    'uiWordSubmission',
    {
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
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        { fields: ['userId'] },
        { fields: ['uiEnglishWordId'] },
        { fields: ['languageId'] },
        { fields: ['embeddingAppId'] },
        { fields: ['translation'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  UiWordSubmission.belongsTo(User, primaryKey)
  User.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(UiEnglishWord, primaryKey)
  UiEnglishWord.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(Language, primaryKey)
  Language.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(UiWordSubmission)

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  connectionObj,
  setUpConnection,
}
