const Sequelize = require('sequelize')

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
    timestamps: false,
  }

  const isArrayOfWordObjs = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    const wordObjStructure = {
      lemma: "string",
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

  const isArrayOfLXXObjs = ary => {
    if(!(ary instanceof Array)) {
      throw new Error('Must be an array.')
    }

    const lxxObjStructure = {
      w: "string",
      lemma: "string",
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

  const wordIdRegEx = /^[0-9a-z]{4}$/i
  const verseIdRegEx = /^[0-9]{8}$/
  const versionIdRegEx = /^[a-z0-9]{2,9}$/
  const definitionIdRegEx = /^[HAG][0-9]{5}[a-z]?$/  // strongs number
  const languageIdRegEx = /^[a-z]{3}$/
  const scopeRegEx = /^[a-z]{1,2}|[0-9]{2}$/

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

  const wordNumberInVerse = {  // null if it is a variant
    type: Sequelize.INTEGER.UNSIGNED,
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
      type: Sequelize.STRING,
      unique: 'name',
      allowNull: false,
    },
    englishName: {
      type: Sequelize.STRING,
      unique: 'englishName',
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  ////////////////////////////////////////////////////////////////////

  const Definition = connection.define('definition', Object.assign({
    id: {
      type: Sequelize.STRING(11),
      primaryKey: true,
      validate: {
        is: definitionIdRegEx,
      },
    },
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

  ////////////////////////////////////////////////////////////////////

  const DefinitionByLangauge = connection.define('definitionByLangauge', Object.assign({
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
    lexEntryUsfm: { ...usfm },
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

  Language.belongsToMany(Definition, { through: DefinitionByLangauge })
  Definition.belongsToMany(Language, { through: DefinitionByLangauge })

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
    scope: {  // typically nt, ot, or null; null indicates this version covers the entire (canonical) Bible
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
        fields: ['scope'],
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
    ],
  }))

  Version.belongsTo(Language, required)
  Language.hasMany(Version)

  //////////////////////////////////////////////////////////////////

  // Built off the assumption that alternative lemma or morphological
  // interpretations will NOT be considered in search. However, this
  // does not mean that such things could not be indicated as footnotes
  // in the text.

  const uhbWord = connection.define('uhbWord', Object.assign({
    id: wordId,
    bookId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 39,
      },
    },
    chapter: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 150,
      },
    },
    verse: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 176,
      },
    },
    sectionNumber: {  // sections separated by ס or פ (or chapter?)
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    wordNumberInVerse,
    nakedWord,
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
        fields: ['sectionNumber'],
      },
      {
        fields: ['wordNumberInVerse'],
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
    id: verseId,
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const uhbTagSet = connection.define('uhbTagSet', Object.assign({
    tags: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['uhbVerseId'],
      },
      {
        fields: ['versionId'],
      },
    ],
  }, noTimestampsOptions))

  uhbVerse.belongsToMany(Version, { through: uhbTagSet })
  Version.belongsToMany(uhbVerse, { through: uhbTagSet })

  //////////////////////////////////////////////////////////////////

  const uhbTranslation = connection.define('uhbTranslation', Object.assign({
    tr: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isObjOfHits,
      },
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['uhbVerseId'],
      },
      {
        fields: ['versionId'],
      },
    ],
  }, noTimestampsOptions))

  uhbVerse.belongsToMany(Version, { through: uhbTranslation })
  Version.belongsToMany(uhbVerse, { through: uhbTranslation })

  //////////////////////////////////////////////////////////////////

  const ugntWord = connection.define('ugntWord', Object.assign({
    bookId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 40,
        max: 66,
      },
    },
    chapter: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 28,
      },
    },
    verse: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 80,
      },
    },
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
    wordNumberInVerse,
    nakedWord,
    pos: {
      type: Sequelize.ENUM('N', 'A', 'E', 'R', 'V', 'I', 'P', 'D', 'C', 'T'),
      allowNull: false,
    },
    type: {  // includes the pos to remove ambiguity
      type: Sequelize.ENUM(
        'NS', 'NP', 'AA', 'AR', 'EA', 'ED', 'EF', 'EP', 'EQ', 'EN', 'EO', 'ER',
        'ET', 'RD', 'RE', 'RP', 'RC', 'RI', 'RR', 'RT', 'VT', 'VI', 'VL', 'VM',
        'VP', 'IE', 'ID', 'IR', 'PI', 'DO', 'CC', 'CS', 'CO', 'TF'
      ),
    },
    mood: {
      type: Sequelize.ENUM('I', 'M', 'S', 'O', 'N', 'P'),
    },
    aspect: {
      type: Sequelize.ENUM('P', 'I', 'F', 'A', 'E', 'L'),
    },
    voice: {
      type: Sequelize.ENUM('A', 'M', 'P'),
    },
    person: {
      type: Sequelize.ENUM('1', '2', '3'),
    },
    case: {
      type: Sequelize.ENUM('N', 'D', 'G', 'A', 'V'),
    },
    gender: {
      type: Sequelize.ENUM('M', 'F', 'N'),
    },
    number: {
      type: Sequelize.ENUM('S', 'P'),
    },
    attribute: {
      type: Sequelize.ENUM('C', 'S', 'D', 'I'),
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
        fields: ['phraseNumber'],
      },
      {
        fields: ['sentenceNumber'],
      },
      {
        fields: ['paragraphNumber'],
      },
      {
        fields: ['wordNumberInVerse'],
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
    id: verseId,
    usfm,
  }), Object.assign({
    indexes: [
    ],
  }, noTimestampsOptions))

  //////////////////////////////////////////////////////////////////

  const ugntTagSet = connection.define('ugntTagSet', Object.assign({
    tags: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['ugntVerseId'],
      },
      {
        fields: ['versionId'],
      },
    ],
  }, noTimestampsOptions))

  ugntVerse.belongsToMany(Version, { through: ugntTagSet })
  Version.belongsToMany(ugntVerse, { through: ugntTagSet })

  //////////////////////////////////////////////////////////////////

  const ugntTranslation = connection.define('ugntTranslation', Object.assign({
    tr: {
      type: Sequelize.JSON,
      allowNull: false,
      validate: {
        isObjOfHits,
      },
    },
  }), Object.assign({
    indexes: [
      {
        fields: ['ugntVerseId'],
      },
      {
        fields: ['versionId'],
      },
    ],
  }, noTimestampsOptions))

  ugntVerse.belongsToMany(Version, { through: ugntTranslation })
  Version.belongsToMany(ugntVerse, { through: ugntTranslation })

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

  const UiWord = connection.define('uiWord', Object.assign({
    str: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
    },
    desc: {
      type: Sequelize.STRING,
      notEmpty: true,
    },
    translation: {
      type: Sequelize.TEXT,
      allowNull: false,
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
        fields: ['languageId'],
      },
    ],
  }))

  UiWord.belongsTo(Language, required)
  Language.hasMany(UiWord)

  //////////////////////////////////////////////////////////////////

  return connection

}

module.exports = {
  createConnection,
  nullLikeDate,
}
