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
  wordsHashLength,
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
        // console.log(`Query: ${query}`)
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
    // eg. "i8eeWqiuDiufAA" for a seven-word verse (2 letters per word)
    // Effectively works to distiguish verses which differ due to being
    // from two different editions of a single Bible version.
    type: Sequelize.STRING(wordsHashLength),
    allowNull: false,
    validate: {
      is: wordsHashRegEx,
    },
  }

  const wordNumberInVerse = {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  }

  const wordComboHash = {
    type: Sequelize.STRING(24),
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
    notEmpty: true,
  }

  // const createdAtDesc = { attribute: 'createdAt', order: 'DESC' }
  // const updatedAtDesc = { attribute: 'updatedAt', order: 'DESC' }

  const required = { foreignKey: { allowNull: false } }
  const onDeleteAddition = setUpCascadeDeletes ? { onDelete: 'CASCADE' } : {}
  const requiredWithCascadeDelete = { foreignKey: { allowNull: false }, ...onDeleteAddition }
  const primaryKey = { foreignKey: { allowNull: false, primaryKey: true } }

  //////////////////////////////////////////////////////////////////

  // needed: app (partial), biblearc (partial)
  // changes some
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
      definitionPreferencesForVerbs: {
        type: Sequelize.JSON,  // an array of search criteria; eg. ["#infinitive-construct","#infinitive","#participle#1st#singular","#present#1st#singular"]
        allowNull: false,
        validate: {
          isDefinitionFormPreferences,
        },
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

  // needed: app, biblearc
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
          isArrayOfLXXObjs,
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

  ////////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const DefinitionUpdateItem = connection.define(
    'definitionUpdateItem',
    {},
    {
      indexes: [
        { fields: ['createdAt'] },
        { fields: ['definitionId', 'createdAt'] },
      ],
      updatedAt: false,
    },
  )

  DefinitionUpdateItem.belongsTo(Definition, required)
  Definition.hasMany(DefinitionUpdateItem)

  //////////////////////////////////////////////////////////////////

  // needed: app, biblearc
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

  // needed: app (partial), biblearc (partial)
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

  Version.belongsTo(Language, required)
  Language.hasMany(Version)

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

  User.belongsTo(Language, required)
  Language.hasMany(User)

  ////////////////////////////////////////////////////////////////////

  // needed: app (partial), biblearc (partial)
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
        { fields: ['editorId'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  LanguageSpecificDefinition.belongsTo(Language, required)
  Language.hasMany(LanguageSpecificDefinition)

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

  // needed: app, biblearc
  // changes often
  const TagSet = connection.define(
    'tagSet',
    {
      loc,
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      autoMatchScores: {  // NOT included in offline version; this array matches tags item for item
        type: Sequelize.JSON,
        // null indicates it is based on a human submission
      },
      status: {
        type: Sequelize.ENUM(
          'automatch',  // no human submission yet
          'unconfirmed',  // contains human submission, but contains at least some tags which are not confirmed strongly enough
          'confirmed'  // contains human submission and is strongly confirmed
        ),
        allowNull: false,
      },
      wordsHash,
    },
    {
      indexes: [
        {
          fields: ['loc', 'wordsHash', 'versionId'],
          unique: true,
          name: 'loc_wordsHash_versionId',
        },
        { fields: ['loc', 'status'] },
        { fields: ['versionId', 'status'] },
        { fields: ['wordsHash'] },
        { fields: ['status'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  TagSet.belongsTo(Version, required)
  Version.hasMany(TagSet)

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

  // This table and the next used in the auto-tagging process
  // since we do now know the actual (copyrighted) words of the translations.

  // needed: none
  // changes often
  const WordHashesSetSubmission = connection.define(
    'wordHashesSetSubmission',
    {
      loc,
      wordsHash,
      createdAt,
    },
    {
      indexes: [
        {
          fields: ['versionId', 'wordsHash', 'loc'],
          unique: true,
          name: 'versionId_wordsHash_loc',
        },
        { fields: ['loc'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,
    },
  )

  WordHashesSetSubmission.belongsTo(Version, required)
  Version.hasMany(WordHashesSetSubmission)

  WordHashesSetSubmission.belongsTo(EmbeddingApp, required)
  EmbeddingApp.hasMany(WordHashesSetSubmission)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const WordHashesSubmission = connection.define(
    'wordHashesSubmission',
    {
      wordNumberInVerse,
      hash: { ...wordComboHash },
      withBeforeHash: { ...wordComboHash },
      withAfterHash: { ...wordComboHash },
      withBeforeAndAfterHash: { ...wordComboHash },
    },
    {
      indexes: [
        {
          fields: ['wordHashesSetSubmissionId', 'wordNumberInVerse'],
          unique: true,
          name: 'wordHashesSetSubmissionId_wordNumberInVerse',
        },
        { fields: ['hash'] },
        { fields: ['withBeforeHash'] },
        { fields: ['withAfterHash'] },
        { fields: ['withBeforeAndAfterHash'] },
      ],
      timestamps: false,  // timestamps for this data kep in related WordHashesSetSubmission row
    },
  )

  WordHashesSubmission.belongsTo(WordHashesSetSubmission, required)
  WordHashesSetSubmission.hasMany(WordHashesSubmission)

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

  const uhbUnitWord = connection.define(
    `uhbUnitWord`,
    {
      id: {  // ["verse"/"paragraph"/"section"]:[word/parsing_detail]
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

  // needed: app, biblearc
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

  const ugntUnitWord = connection.define(
    `ugntUnitWord`,
    {
      id: {  // ["verse"/"phrase"/"sentence"/"paragraph"]:[word/parsing_detail]
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

  // needed: app, biblearc
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
        { fields: ['bookId', 'chapter', 'verse'] },
        { fields: ['bookId', 'wordNumber'] },
        { fields: ['bookId', 'verseNumber'] },
        { fields: ['form'] },
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
      timestamps: false,  // Derived from import files.
    },
  )

  lxxWord.belongsTo(Definition, required)
  Definition.hasMany(lxxWord)

  //////////////////////////////////////////////////////////////////

  // needed: app, biblearc
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

  // needed: app, biblearc
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

  // needed: app, biblearc
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

  // needed: app, biblearc
  // changes often
  const WordTranslationDefinition = connection.define(
    'wordTranslationDefinition',
    {},
    {
      indexes: [
        {
          fields: ['definitionId', 'wordTranslationId'],
          unique: true,
          name: 'definitionId_wordTranslationId',
        },
        { fields: ['wordTranslationId'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  WordTranslationDefinition.belongsTo(WordTranslation, requiredWithCascadeDelete)
  WordTranslation.hasMany(WordTranslationDefinition)

  WordTranslationDefinition.belongsTo(Definition, required)
  Definition.hasMany(WordTranslationDefinition)

  //////////////////////////////////////////////////////////////////

  // needed: app, biblearc
  // doesn't change
  const HitsByScope = connection.define(
    'hitsByScope',
    {
      scope,
      hits,
    },
    {
      indexes: [
        {
          fields: ['definitionId', 'scope'],
          unique: true,
          name: 'definitionId_scope',
        },
        { fields: ['scope'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  HitsByScope.belongsTo(Definition, required)
  Definition.hasMany(HitsByScope)

  //////////////////////////////////////////////////////////////////

  // needed: app, biblearc
  // doesn't change
  // NOT SURE WE NEED THIS - shouldn't this rather be HitsByMorph so as to give a quick number to the "Search inflected" option?
  const HitsByForm = connection.define(
    'hitsByForm',
    {
      form: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      hits,
    },
    {
      indexes: [
        {
          fields: ['definitionId', 'form'],
          unique: true,
          name: 'definitionId_form',
        },
        { fields: ['form'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  HitsByForm.belongsTo(Definition, required)
  Definition.hasMany(HitsByForm)

  //////////////////////////////////////////////////////////////////

  // needed: app, biblearc
  // doesn't change
  const HitsInLXXByScope = connection.define(
    'hitsInLXXByScope',
    {
      scope,
      hits,
    },
    {
      indexes: [
        {
          fields: ['definitionId', 'scope'],
          unique: true,
          name: 'definitionId_scope',
        },
        { fields: ['scope'] },
        { fields: ['hits'] },
      ],
      timestamps: false,  // Used in tables which can be completely derived from other tables and base import files.
    },
  )

  HitsInLXXByScope.belongsTo(Definition, required)
  Definition.hasMany(HitsInLXXByScope)

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

  UiWord.belongsTo(Language, required)
  Language.hasMany(UiWord)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const UiWordSubmission = connection.define(
    'uiWordSubmission',
    {
      translation,
      createdAt,
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

  UiWordSubmission.belongsTo(Language, required)
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
