const Sequelize = require('sequelize')
const retry = require('retry-as-promised')
const { isValidBibleSearch } = require('@bibletags/bibletags-ui-helper')

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
  wordsHashRegEx,
} = require('../constants')

const MAX_CONNECTION_AGE = 1000 * 60 * 60 * 7.5

const connectionObj = {
  host: process.env.RDS_HOST || 'localhost',
  database: process.env.RDS_DATABASE || 'BibleTags',
  user: process.env.RDS_USERNAME || 'root',
  password: process.env.RDS_PASSWORD || '',
  port: process.env.RDS_PORT || '3306',
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

const deletedAt = {
  type: Sequelize.DATE(3),
  allowNull: true,
}

const languageId = {
  type: Sequelize.STRING(3),
  validate: {
    is: languageIdRegEx,
  },
  allowNull: false,
}

const loc = {
  type: Sequelize.STRING(8),
  validate: {
    is: locRegEx,
  },
}

const locPrimaryKey = {
  type: Sequelize.STRING(8),
  primaryKey: true,
  validate: {
    is: locRegEx,
  },
}

const wordsHash = {
  // Effectively works to distiguish verses which differ due to being
  // from two different editions of a single Bible version.
  type: Sequelize.STRING(4),
  allowNull: false,
  validate: {
    is: wordsHashRegEx,
  },
}

const wordNumberInVerse = {
  type: Sequelize.INTEGER.UNSIGNED,
  allowNull: false,
}

const hash = {
  type: Sequelize.STRING(6),
  allowNull: false,
  notEmpty: true,
}

const wordComboHash = {
  type: Sequelize.STRING(3),
  allowNull: false,
  notEmpty: true,
}

const scope = {
  type: Sequelize.STRING(2),
  allowNull: false,
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

const form = {  // no capitalization, accents, vowels or diacritical marks
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
    'AS', 'AP', 'AA', 'AR', 'EA', 'ED', 'EF', 'EP', 'EQ', 'EN', 'EO', 'ER', 'ET',
    'PD', 'PE', 'PP', 'PC', 'PI', 'PR', 'PT',  // these are R_ in the usfm, but changed to P_ in importUGNTFromUsfm to match UHB
    'VT', 'VI', 'VL', 'VM', 'VP',  // these presently are not used, but perhaps they will be in the future
    'IE', 'ID', 'IR', 'DI', 'DO', 'CC', 'CS', 'CO', 'FF'
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

const wordPartNumber = {
  type: Sequelize.INTEGER.UNSIGNED,
  allowNull: false,
}

const translation = {
  type: Sequelize.STRING(translationLength),
  allowNull: false,
}

const createdAtDesc = { attribute: 'createdAt', order: 'DESC' }
// const updatedAtDesc = { attribute: 'updatedAt', order: 'DESC' }

const required = { foreignKey: { allowNull: false } }
const primaryKey = { foreignKey: { allowNull: false, primaryKey: true } }

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
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_bin',
      host: connectionObj.host,
      port: connectionObj.port,
      logging: (query, msEllapsed) => {
        // console.log(`Query: ${query}`)
        msEllapsed > 1000 ? console.log(`WARNING: Slow query (${msEllapsed/1000} seconds). ${query}`) : null
      },
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
        max: 10,
        // This was 100; trying 10 as having this too big MIGHT cause the DB to exceed max_connections (SHOW VARIABLES LIKE "max_connections";).
        // I have not confirmed that this was, in fact, the cause of the issue. But the default of max:5 and the errors make this my best guess.
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

  const isTranslationBreadown = ary => {
    // eg. [ [``, [ { tr: "well", hits: 12, forms: [ "באר" ] } ]], [`באר שבע`, [ ... ]] ]

    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    ary.forEach(wordComboAry => {

      if(!(wordComboAry instanceof Array) || wordComboAry.length !== 2) {
        throw new Error('Each item must be an array of two items.')
      }
      if(typeof wordComboAry[0] !== "string") {
        throw new Error('First item of every second level array must be a string.')
      }
      if(!(wordComboAry[1] instanceof Array)) {
        throw new Error('Second item of every second level array must be an array.')
      }

      wordComboAry[1].forEach(translationObj => {
        if(typeof translationObj !== "object") {
          throw new Error('Each third level item must be an object.')
        }
        if(typeof translationObj.tr !== "string") {
          throw new Error('tr key must be a string')
        }
        if(!Number.isInteger(translationObj.hits)) {
          throw new Error('hits key must be an integer')
        }
        if(translationObj.forms && (!(translationObj.forms instanceof Array) || !translationObj.forms.every(item => typeof item === "string"))) {
          throw new Error('forms key must be an array of strings')
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
    //   isAramaic: true,
    //   root: [
    //     "דגכ",
    //     "H73642"
    //   ],
    //   poss: [
    //     {
    //       pos: "verb",
    //       types: [
    //         {
    //           type: "transitive",
    //           meaning: [
    //             {
    //               text: "[transitive def]",
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
    //   alts: [
    //     {
    //       text: "[bdb entry in usfm]"
    //     },
    //   ],
    // }
  }

  const isArrayOfLXXObjsOrInteger = ary => {

    // if(!(ary instanceof Array)) throw new Error('Must be an array')

    // if(typeof ary[0] === `number`) {

    //   // for Greek words

    //   if(ary.length !== 2) throw new Error('Must list two whole numbers')

    //   ary.forEach(num => {
    //     if(!Number.isInteger(num) || num < 0) throw new Error('Must list two whole numbers')
    //   })

    if(!(ary instanceof Array)) {

      // for Greek words

      if(!Number.isInteger(ary) || ary < 0) throw new Error('Must be an array or object.')

    } else {

      // for Hebrew words

      const lxxObjStructureForHebrew = {
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
          if(typeof wordObj[key] !== lxxObjStructureForHebrew[key]) {
            throw new Error('Objects must match lxx object structure: ' + JSON.stringify(lxxObjStructureForHebrew))
          }
        })
      })

    }

  }

  const isArrayOfStrings = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    if(ary.some(str => typeof str !== 'string')) {
      throw new Error('Array must contain strings.')
    }
  }

  const isVerseMappings = obj => {

    if(typeof obj !== 'object') {
      throw new Error('Must be an object.')
    }

    const singleVerseRegEx = /^[0-9]{8}(?::[0-9]{1,3}(?:-[0-9]{0,3})?(?:,[0-9]{1,3}(?:-[0-9]{0,3})?)*)?$/
    const rangeRegEx = /^[0-9]{8}(?:-[0-9]{3})?$/
    
    Object.keys(obj).forEach(key => {
      if(singleVerseRegEx.test(key) && singleVerseRegEx.test(obj[key])) {
        // Valid option. Examples:
        // "02011030": "02012001",
        // "05022005:1-5": "05022005",
        // "05022005:6-10": "05022006",
        // "08002009:5-10": "08002009:1-7",
        // "08002010:4-": "08002009:8-",

      } else if(singleVerseRegEx.test(key) && obj[key] === null) {
        // Valid option. Examples:
        // "05022005:1-5": null,
        
      } else if(rangeRegEx.test(key) && typeof obj[key] === "number") {
        // Valid option. Example:
        // "02012001-021": -1,

      } else {
        throw new Error(`Invalid versification rule. ${key}: ${obj[key]}`)
      }
    })
  }

  const isDefinitionFormPreferences = ary => {

    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    if(
      ary.some(query => (
        typeof query !== 'string'
        || !isValidBibleSearch({ query })
      ))
    ) {
      throw new Error('Must be an array of original language searches.')
    }
  }

  const onDeleteAddition = setUpCascadeDeletes ? { onDelete: 'CASCADE' } : {}
  const requiredWithCascadeDelete = { foreignKey: { allowNull: false }, ...onDeleteAddition }
  
  //////////////////////////////////////////////////////////////////

  // needed: app (in combo with PartOfSpeech and LanguageSpecificDefinition), biblearc
  // doesn't change
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
      nakedLex: {
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
      simplifiedVocal: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      hits,
      lxx: {
        type: Sequelize.JSON,
        allowNull: false,
        validate: {
          isArrayOfLXXObjsOrInteger,
        },
      },
      lemmas: {
        type: Sequelize.JSON,
        allowNull: false,
        validate: {
          isArrayOfStrings,
        },
      },
      forms: {
        type: Sequelize.JSON,
        allowNull: false,
        validate: {
          isArrayOfStrings,
        },
      },
    },
    {
      indexes: [
        { fields: ['lex'] },
        { fields: ['lexUnique'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: app (in combo with Definition and LanguageSpecificDefinition), biblearc
  // doesn't change
  const PartOfSpeech = connection.define(
    'partOfSpeech',
    {
      pos: {
        type: Sequelize.ENUM('A', 'C', 'D', 'N', 'P', 'R', 'T', 'V', 'E', 'I', 'F'),
        primaryKey: true,
      },
    },
    {
      indexes: [
        { fields: ['pos'] },
        { fields: ['definitionId'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  PartOfSpeech.belongsTo(Definition, primaryKey)
  Definition.hasMany(PartOfSpeech)

  //////////////////////////////////////////////////////////////////

  // needed: app (in versions.json), biblearc (partial)
  // changes some
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
      languageId,
    },
    {
      indexes: [
        {
          fields: ['name'],
          unique: true,
          name: 'name',
        },
        { fields: ['partialScope'] },
        { fields: ['versificationModel'] },
        { fields: ['skipsUnlikelyOriginals'] },
        { fields: ['languageId'] },
      ],
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const EmbeddingApp = connection.define(
    'embeddingApp',
    {
      // will need a default row where uri=import
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      uri: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      secretKey: {
        type: Sequelize.UUID,
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        {
          fields: ['uri'],
          unique: true,
          name: 'uri',
        },
      ],
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const User = connection.define(
    'user',
    {
      // will need a default row where id=import, with rating of 5
      id: {  // received from session-sync-auth OR user-[deviceId]@bibletags.org (for non-authenticated users)
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      email: {  // for non-authenticated users: user-[deviceId]@bibletags.org
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: Sequelize.STRING(255),
        notEmpty: true,
      },
      image: {
        type: Sequelize.STRING(255),
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      ratingHistory: {  // each adjustment (with description) on a separate line
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: `Initial: 2`,
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
      languageId,
    },
    {
      indexes: [
        {
          fields: ['email'],
          unique: true,
          name: 'email',
        },
        { fields: ['rating'] },
        { fields: ['flaggedForAbuse'] },
        { fields: ['createdAt'] },
        { fields: ['updatedAt'] },
      ],
    },
  )

  ////////////////////////////////////////////////////////////////////

  // needed: app (partial: in combo with PartOfSpeech and Definition), biblearc (partial)
  // changes some
  const LanguageSpecificDefinition = connection.define(
    'languageSpecificDefinition',
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
      createdAt,
      updatedAt,
      languageId,
    },
    {
      indexes: [
        {
          fields: ['languageId', 'definitionId'],
          unique: true,
          name: 'languageId_definitionId',
        },
        { fields: ['gloss'] },
        { fields: ['definitionId', 'editorId'] },
        { fields: ['editorId', 'updatedAt'] },
        { fields: ['languageId', 'updatedAt'] },
      ],
    },
  )

  LanguageSpecificDefinition.belongsTo(Definition, required)
  Definition.hasMany(LanguageSpecificDefinition)

  LanguageSpecificDefinition.belongsTo(User, { as: 'editor' })
  User.hasMany(LanguageSpecificDefinition, { as: 'languageSpecificDefinitionsWhereIAmEditor', foreignKey: 'editorId' })

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const UserEmbeddingApp = connection.define(
    'userEmbeddingApp',
    {
      createdAt,
    },
    {
      indexes: [
        { fields: ['userId'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,
    },
  )

  User.belongsToMany(EmbeddingApp, { through: UserEmbeddingApp })
  EmbeddingApp.belongsToMany(User, { through: UserEmbeddingApp })

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
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
    },
    {
      indexes: [
        { fields: ['adjustment'] },
        { fields: ['userId'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,
    },
  )

  UserRatingAdjustment.belongsTo(User, requiredWithCascadeDelete)
  User.hasMany(UserRatingAdjustment)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const TagSetSubmission = connection.define(
    'tagSetSubmission',
    {
      loc,
      wordsHash,
      createdAt,
    },
    {
      indexes: [
        {
          fields: ['versionId', 'wordsHash', 'loc', 'userId',],
          unique: true,
          name: 'versionId_wordsHash_loc_userId',
        },
        { fields: ['userId'] },
        { fields: ['loc'] },
        { fields: ['versionId', 'loc'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,
    },
  )

  TagSetSubmission.belongsTo(User, required)
  User.hasMany(TagSetSubmission)

  TagSetSubmission.belongsTo(Version, required)
  Version.hasMany(TagSetSubmission)

  TagSetSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(TagSetSubmission)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const TagSetSubmissionItem = connection.define(
    'tagSetSubmissionItem',
    {
      alignmentType: {
        type: Sequelize.ENUM('affirmation', 'correction', 'without-suggestion'),
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ['tagSetSubmissionId', 'alignmentType'] },
        { fields: ['alignmentType'] },
      ],
      timestamps: false,  // timestamps for this data kept in related TagSetSubmission row
    },
  )

  TagSetSubmissionItem.belongsTo(TagSetSubmission, requiredWithCascadeDelete)
  TagSetSubmission.hasMany(TagSetSubmissionItem)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const TagSetSubmissionItemTranslationWord = connection.define(
    'tagSetSubmissionItemTranslationWord',
    {
      wordNumberInVerse,
      word: {
        type: Sequelize.STRING(translationWordLength),
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [
        { fields: ['tagSetSubmissionItemId'], name: 'tagSetSubmissionItemId' },
        { fields: ['word'] },
      ],
      timestamps: false,  // timestamps for this data kept in related TagSetSubmission row
    },
  )

  TagSetSubmissionItemTranslationWord.belongsTo(TagSetSubmissionItem, requiredWithCascadeDelete)
  TagSetSubmissionItem.hasMany(TagSetSubmissionItemTranslationWord)

  //////////////////////////////////////////////////////////////////

  // Built off the assumption that alternative lemma or morphological
  // interpretations will NOT be considered in search. However, this
  // does not mean that such things could not be indicated as footnotes
  // in the text.

  // needed: none
  // doesn't change
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
      sectionNumber: {  // sections separated by ס or פ (or chapter?); reset in each book
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      paragraphNumber: {  // reset in each book
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      form,
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
        { fields: ['bookId', 'chapter', 'verse'] },
        { fields: ['bookId', 'wordNumber'] },
        { fields: ['bookId', 'verseNumber'] },
        { fields: ['bookId', 'sectionNumber'] },
        { fields: ['bookId', 'paragraphNumber'] },
        { fields: ['form', 'bookId', 'wordNumber'] },
        { fields: ['lemma', 'bookId', 'wordNumber'] },
        { fields: ['fullParsing', 'bookId', 'wordNumber'] },
        { fields: ['isAramaic', 'bookId', 'wordNumber'] },
        { fields: ['b', 'bookId', 'wordNumber'] },
        { fields: ['l', 'bookId', 'wordNumber'] },
        { fields: ['k', 'bookId', 'wordNumber'] },
        { fields: ['m', 'bookId', 'wordNumber'] },
        { fields: ['sh', 'bookId', 'wordNumber'] },
        { fields: ['v', 'bookId', 'wordNumber'] },
        { fields: ['h1', 'bookId', 'wordNumber'] },
        { fields: ['h2', 'bookId', 'wordNumber'] },
        { fields: ['h3', 'bookId', 'wordNumber'] },
        { fields: ['pos', 'bookId', 'wordNumber'] },
        { fields: ['stem', 'bookId', 'wordNumber'] },
        { fields: ['aspect', 'bookId', 'wordNumber'] },
        { fields: ['type', 'bookId', 'wordNumber'] },
        { fields: ['person', 'bookId', 'wordNumber'] },
        { fields: ['gender', 'bookId', 'wordNumber'] },
        { fields: ['number', 'bookId', 'wordNumber'] },
        { fields: ['state', 'bookId', 'wordNumber'] },
        { fields: ['h4', 'bookId', 'wordNumber'] },
        { fields: ['h5', 'bookId', 'wordNumber'] },
        { fields: ['n', 'bookId', 'wordNumber'] },
        { fields: ['suffixPerson', 'bookId', 'wordNumber'] },
        { fields: ['suffixGender', 'bookId', 'wordNumber'] },
        { fields: ['suffixNumber', 'bookId', 'wordNumber'] },
        { fields: ['definitionId', 'bookId', 'wordNumber'] },
      ],
      timestamps: false,  // Derived from import files.
    },
  )

  uhbWord.belongsTo(Definition)
  Definition.hasMany(uhbWord)

  //////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const uhbUnitWord = connection.define(
    `uhbUnitWord`,
    {
      id: {  // ["verseNumber"/"paragraph"/"section"]:[word/parsing_detail]
        type: Sequelize.STRING(translationWordLength + 11),  // 11 for "paragraph:="
        primaryKey: true,
      },
      scopeMap: {
        // contains JSON; did not use JSON type column, however, since that type does not maintain key order
        /*
          value structure for verse type:
            {
              "[loc]-": [
                [
                  wordNumber,  // in book
                  "form",
                  definitionId,  // as int; 0 if none
                  "lemma",  // 0 if none
                  "H[type/pos_][stem][aspect][person][gender][number][state]"  // each hold designated # of chars for a total of 9 chars; if detail is NULL, char(s) will be _; type includes pos; if type is NULL, will show as [pos]_
                  "b3",  // last chars of whichever the following are true: isAramaic,b,l,k,m,sh,v,h1,h2,h3,h4,h5,n; only include if there something or a suffix
                  "1ms",  // only include if there is a suffix
                ],
              ],
            }
          keys for other types: "[bookId]:[paragraphNumber/sectionNumber]"
        */
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [],
      timestamps: false,
    },
  )

  ////////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const uhbUnitRange = connection.define(
    `uhbUnitRange`,
    {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      originalLoc: {
        type: Sequelize.STRING(17),  // BBCCCVVV-BBCCCVVV
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [],
      timestamps: false,
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const uhbVerse = connection.define(
    'uhbVerse',
    {
      loc: locPrimaryKey,
      usfm,
    },
    {
      indexes: [
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const uhbTagSubmission = connection.define(
    'uhbTagSubmission',
    {
      wordPartNumber,
    },
    {
      indexes: [
        {
          fields: ['uhbWordId', 'wordPartNumber', 'tagSetSubmissionItemId'],
          unique: true,
          name: 'uhbWordId_wordPartNumber_tagSetSubmissionItemId',
        },
        { fields: ['tagSetSubmissionItemId'] },
      ],
      timestamps: false,  // timestamps for this data kep in related TagSetSubmission row
    },
  )

  uhbTagSubmission.belongsTo(TagSetSubmissionItem, requiredWithCascadeDelete)
  TagSetSubmissionItem.hasMany(uhbTagSubmission)

  uhbTagSubmission.belongsTo(uhbWord, required)
  uhbWord.hasMany(uhbTagSubmission)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // doesn't change
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
      form,
      lemma,
      fullParsing,
      pos: greekPos,  // Different than UGNT's pos for a few types. Eg. NS (substantive adjective) is considered an adjective. Also, R and P are flipped to match UHB.
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
        { fields: ['bookId', 'chapter', 'verse'] },
        { fields: ['bookId', 'wordNumber'] },
        { fields: ['bookId', 'verseNumber'] },
        { fields: ['bookId', 'phraseNumber'] },
        { fields: ['bookId', 'sentenceNumber'] },
        { fields: ['bookId', 'paragraphNumber'] },
        { fields: ['form', 'bookId', 'wordNumber'] },
        { fields: ['lemma', 'bookId', 'wordNumber'] },
        { fields: ['fullParsing', 'bookId', 'wordNumber'] },
        { fields: ['pos', 'bookId', 'wordNumber'] },
        { fields: ['morphPos', 'bookId', 'wordNumber'] },
        { fields: ['type', 'bookId', 'wordNumber'] },
        { fields: ['mood', 'bookId', 'wordNumber'] },
        { fields: ['aspect', 'bookId', 'wordNumber'] },
        { fields: ['voice', 'bookId', 'wordNumber'] },
        { fields: ['person', 'bookId', 'wordNumber'] },
        { fields: ['case', 'bookId', 'wordNumber'] },
        { fields: ['gender', 'bookId', 'wordNumber'] },
        { fields: ['number', 'bookId', 'wordNumber'] },
        { fields: ['attribute', 'bookId', 'wordNumber'] },
        { fields: ['definitionId', 'bookId', 'wordNumber'] },
      ],
      timestamps: false,  // Derived from import files.
    },
  )

  ugntWord.belongsTo(Definition, required)
  Definition.hasMany(ugntWord)

  //////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const ugntUnitWord = connection.define(
    `ugntUnitWord`,
    {
      id: {  // ["verseNumber"/"phrase"/"sentence"/"paragraph"]:[word/parsing_detail]
        type: Sequelize.STRING(translationWordLength + 11),  // 11 for "paragraph:="
        primaryKey: true,
      },
      scopeMap: {
        // contains JSON; did not use JSON type column, however, since that type does not maintain key order
        /*
          value structure for verse type:
            {
              "[loc]-": [
                [
                  wordNumber,  // in book
                  "form",
                  definitionId,  // as int
                  "lemma",
                  "G[type/pos_][mood][voice][aspect][person][gender][number][case][attribute]"  // each hold designated # of chars for a total of 11 chars; if detail is NULL, char(s) will be _; type includes pos; if type is NULL, will show as [pos]_
                ],
              ],
            }
          keys for other types: "[bookId]:[phraseNumber/sentenceNumber/paragraphNumber]"
        */
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [],
      timestamps: false,
    },
  )

  ////////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const ugntUnitRange = connection.define(
    `ugntUnitRange`,
    {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      originalLoc: {
        type: Sequelize.STRING(17),  // BBCCCVVV-BBCCCVVV
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [],
      timestamps: false,
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const ugntVerse = connection.define(
    'ugntVerse',
    {
      loc: locPrimaryKey,
      usfm,
    },
    {
      indexes: [
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const ugntTagSubmission = connection.define(
    'ugntTagSubmission',
    {},
    {
      indexes: [
        {
          fields: ['ugntWordId', 'tagSetSubmissionItemId'],
          unique: true,
          name: 'ugntWordId_tagSetSubmissionItemId',
        },
        { fields: ['tagSetSubmissionItemId'] },
      ],
      timestamps: false,  // timestamps for this data kep in related TagSetSubmission row
    },
  )

  ugntTagSubmission.belongsTo(TagSetSubmissionItem, requiredWithCascadeDelete)
  TagSetSubmissionItem.hasMany(ugntTagSubmission)

  ugntTagSubmission.belongsTo(ugntWord, required)
  ugntWord.hasMany(ugntTagSubmission)
  
  //////////////////////////////////////////////////////////////////

  // needed: none
  // doesn't change
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
      form,
      lemma,
      fullParsing,
      pos: greekPos,
      morphPos: {  // akin to UGNT's pos
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
        { fields: ['bookId', 'chapter', 'verse'] },
        { fields: ['bookId', 'wordNumber'] },
        { fields: ['bookId', 'verseNumber'] },
        { fields: ['form', 'bookId', 'wordNumber'] },
        { fields: ['lemma', 'bookId', 'wordNumber'] },
        { fields: ['fullParsing', 'bookId', 'wordNumber'] },
        { fields: ['pos', 'bookId', 'wordNumber'] },
        { fields: ['morphPos', 'bookId', 'wordNumber'] },
        { fields: ['type', 'bookId', 'wordNumber'] },
        { fields: ['mood', 'bookId', 'wordNumber'] },
        { fields: ['aspect', 'bookId', 'wordNumber'] },
        { fields: ['voice', 'bookId', 'wordNumber'] },
        { fields: ['person', 'bookId', 'wordNumber'] },
        { fields: ['case', 'bookId', 'wordNumber'] },
        { fields: ['gender', 'bookId', 'wordNumber'] },
        { fields: ['number', 'bookId', 'wordNumber'] },
        { fields: ['attribute', 'bookId', 'wordNumber'] },
        { fields: ['definitionId', 'bookId', 'wordNumber'] },
      ],
      timestamps: false,  // Derived from import files.
    },
  )

  lxxWord.belongsTo(Definition, required)
  Definition.hasMany(lxxWord)

  //////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const lxxUnitWord = connection.define(
    `lxxUnitWord`,
    {
      id: {  // ["verseNumber"/"phrase"/"sentence"/"paragraph"]:[word/parsing_detail]
        type: Sequelize.STRING(translationWordLength + 11),  // 11 for "paragraph:="
        primaryKey: true,
      },
      scopeMap: {
        // contains JSON; did not use JSON type column, however, since that type does not maintain key order
        /*
          value structure for verse type:
            {
              "[loc]-": [
                [
                  wordNumber,  // in book
                  "form",
                  definitionId,  // as int
                  "lemma",
                  "G[type/pos_][mood][voice][aspect][person][gender][number][case][attribute]"  // each hold designated # of chars for a total of 11 chars; if detail is NULL, char(s) will be _; type includes pos; if type is NULL, will show as [pos]_
                ],
              ],
            }
          keys for other types: "[bookId]:[phraseNumber/sentenceNumber/paragraphNumber]"
        */
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [],
      timestamps: false,
    },
  )

  ////////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const lxxUnitRange = connection.define(
    `lxxUnitRange`,
    {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      originalLoc: {
        type: Sequelize.STRING(17),  // BBCCCVVV-BBCCCVVV
        allowNull: false,
        notEmpty: true,
      },
    },
    {
      indexes: [],
      timestamps: false,
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: app (as expo resource), biblearc
  // doesn't change
  const lxxVerse = connection.define(
    'lxxVerse',
    {
      loc: locPrimaryKey,
      // Includes deuterocanonical books, though these are not included
      // in default Bible Tags searches, nor in statistics.
      usfm,
    },
    {
      indexes: [
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  // Covers UHB, UGNT, and LXX

  // needed: app (as expo resource), biblearc
  // doesn't change
  const Lemma = connection.define(
    'lemma',
    {
      id: {
        type: Sequelize.STRING(45),  // used following to arrive at this number: SELECT LENGTH(lemma), lemma FROM uhbWords ORDER BY LENGTH(lemma) DESC LIMIT 1
        primaryKey: true,
        notEmpty: true,
      },
      nakedLemma: {
        type: Sequelize.STRING(45),
        primaryKey: true,
        notEmpty: true,
      },
    },
    {
      indexes: [
        { fields: ['nakedLemma', 'id'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const WordTranslation = connection.define(
    'wordTranslation',
    {
      translation,
      hits,
      // The number of hits might exceed the number of [non-variant] instances of this word
      // for two different reasons. (1) If there is a translation from a variant. (2) If
      // the version has more than a single edition.
    },
    {
      indexes: [
        { fields: ['translation', 'hits'] },
        { fields: ['versionId', 'translation', 'hits'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  WordTranslation.belongsTo(Version, required)
  Version.hasMany(WordTranslation)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const WordTranslationDefinition = connection.define(
    'wordTranslationDefinition',
    {
      form,
    },
    {
      indexes: [
        {
          fields: ['definitionId', 'wordTranslationId'],
          unique: true,
          name: 'definitionId_wordTranslationId',
        },
        { fields: ['wordTranslationId'] },
        { fields: ['definitionId', 'form'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  WordTranslationDefinition.belongsTo(WordTranslation, requiredWithCascadeDelete)
  WordTranslation.hasMany(WordTranslationDefinition)

  WordTranslationDefinition.belongsTo(Definition, required)
  Definition.hasMany(WordTranslationDefinition)

  //////////////////////////////////////////////////////////////////

  // needed: app (partial), biblearc (partial)
  // changes often
  const TranslationBreakdown = connection.define(
    'translationBreakdown',
    {
      breakdown: {
        type: Sequelize.JSON,
        allowNull: false,
        validate: {
          isTranslationBreadown,
        },
      },
      createdAt,
    },
    {
      indexes: [
        {
          fields: ['versionId', 'definitionId'],
          unique: true,
          name: 'versionId_definitionId',
        },
        { fields: ['versionId', 'createdAt'] },
      ],
      updatedAt: false,  // since rows are never updated, but rather destroyed and re-created
    },
  )

  TranslationBreakdown.belongsTo(Version, required)
  Version.hasMany(TranslationBreakdown)

  TranslationBreakdown.belongsTo(Definition, required)
  Definition.hasMany(TranslationBreakdown)

  //////////////////////////////////////////////////////////////////

  // TODO: For =love type searches, I will need more data available offline. This should probably be another table
  // derived from WordTranslation + WordTranslationDefinition. But wait to see how I actually make this work first.

  //////////////////////////////////////////////////////////////////

  // WE DO NOT NEED THE HITS TABLES SO LONG AS THE SEARCH PROVES FAST ENOUGH

  // // needed: app, biblearc
  // // doesn't change
  // const HitsByScope = connection.define(
  //   'hitsByScope',
  //   {
  //     scope,
  //     hits,
  //   },
  //   {
  //     indexes: [
  //       {
  //         fields: ['definitionId', 'scope'],
  //         unique: true,
  //         name: 'definitionId_scope',
  //       },
  //       { fields: ['scope'] },
  //       { fields: ['hits'] },
  //     ],
  //     timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
  //   },
  // )

  // HitsByScope.belongsTo(Definition, required)
  // Definition.hasMany(HitsByScope)

  //////////////////////////////////////////////////////////////////

  // // needed: app, biblearc
  // // doesn't change
  // // NOT SURE WE NEED THIS - shouldn't this rather be HitsByMorph so as to give a quick number to the "Search inflected" option?
  // const HitsByForm = connection.define(
  //   'hitsByForm',
  //   {
  //     form: {
  //       type: Sequelize.STRING(30),
  //       allowNull: false,
  //     },
  //     hits,
  //   },
  //   {
  //     indexes: [
  //       {
  //         fields: ['definitionId', 'form'],
  //         unique: true,
  //         name: 'definitionId_form',
  //       },
  //       { fields: ['form'] },
  //       { fields: ['hits'] },
  //     ],
  //     timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
  //   },
  // )

  // HitsByForm.belongsTo(Definition, required)
  // Definition.hasMany(HitsByForm)

  //////////////////////////////////////////////////////////////////

  // // needed: app, biblearc
  // // doesn't change
  // const HitsInLXXByScope = connection.define(
  //   'hitsInLXXByScope',
  //   {
  //     scope,
  //     hits,
  //   },
  //   {
  //     indexes: [
  //       {
  //         fields: ['definitionId', 'scope'],
  //         unique: true,
  //         name: 'definitionId_scope',
  //       },
  //       { fields: ['scope'] },
  //       { fields: ['hits'] },
  //     ],
  //     timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
  //   },
  // )

  // HitsInLXXByScope.belongsTo(Definition, required)
  // Definition.hasMany(HitsInLXXByScope)

  //////////////////////////////////////////////////////////////////

  // needed: app, biblearc
  // change some
  const UiEnglishWord = connection.define(
    'uiEnglishWord',
    {
      str: {
        type: Sequelize.STRING(255),
        allowNull: false,
        notEmpty: true,
      },
      desc: {
        type: Sequelize.STRING(255),
        notEmpty: true,
      },
      createdAt,
      updatedAt,
    },
    {
      indexes: [
        {
          fields: ['str', 'desc'],
          unique: true,
          name: 'str_desc',
        },
      ],
    },
  )

  //////////////////////////////////////////////////////////////////

  // needed: app (partial), biblearc (partial)
  // change often
  const UiWord = connection.define(
    'uiWord',
    {
      translation,
      languageId,
    },
    {
      indexes: [
        {
          fields: ['uiEnglishWordId', 'languageId'],
          name: 'uiEnglishWordId_languageId',
        },
        { fields: ['translation'] },
        { fields: ['languageId'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  UiWord.belongsTo(UiEnglishWord, requiredWithCascadeDelete)
  UiEnglishWord.hasMany(UiWord)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const UiWordSubmission = connection.define(
    'uiWordSubmission',
    {
      translation,
      createdAt,
      languageId,
    },
    {
      indexes: [
        {
          fields: ['userId', 'languageId', 'uiEnglishWordId'],
          name: 'userId_languageId_uiEnglishWordId',
        },
        { fields: ['languageId', 'uiEnglishWordId'] },
        { fields: ['embeddingAppId'] },
        { fields: ['translation'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,
    },
  )

  UiWordSubmission.belongsTo(User, required)
  User.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(UiEnglishWord, requiredWithCascadeDelete)
  UiEnglishWord.hasMany(UiWordSubmission)

  UiWordSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(UiWordSubmission)

  //////////////////////////////////////////////////////////////////

  const QueuedEmail = connection.define(
    'queuedEmail',
    {
      priority: {
        type: Sequelize.ENUM('NOW', 'HIGH', 'NORMAL', 'LOW'),
        defaultValue: 'NORMAL',
        allowNull: false,
      },
      toAddrs: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      ccAddrs: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      bccAddrs: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      fromAddr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      replyToAddrs: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
      },
      attachments: {
        type: Sequelize.JSON,
      },
      referenceCode: {
        type: Sequelize.STRING,
      },
      error: {
        type: Sequelize.TEXT,
      },
      sentAt: {
        type: Sequelize.DATE(3),
      },
      createdAt,
      updatedAt,
      deletedAt,
    },
    {
      indexes: [
        { fields: ['deletedAt', createdAtDesc] },
        { fields: ['deletedAt', 'priority', createdAtDesc] },
        { fields: ['referenceCode', createdAtDesc] },
        { fields: ['sentAt'] },
      ],
      paranoid: true,
    },
  )

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  connectionObj,
  setUpConnection,
  loc,
  wordsHash,
  createdAt,
  required,
  wordNumberInVerse,
  hash,
  wordComboHash,
}
