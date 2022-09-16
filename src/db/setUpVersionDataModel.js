const Sequelize = require('sequelize')

const {
  loc,
  wordsHash,
  createdAt,
  required,
  wordNumberInVerse,
  hash,
  wordComboHash,
} = require('./connect')

const setUpVersionDataModel = versionId => {

  ////////////////////////////////////////////////////////////////////

  // needed in combined form: app (partial), biblearc (partial)
  // changes often
  global.connection.define(
    `${versionId}TagSet`,
    {
      loc,
      tags: {
        // contains JSON; did not use JSON type column, however, since that type does not maintain key order
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        notEmpty: true,
        get() {
          try {
            return JSON.parse(this.getDataValue('tags'))
          } catch(err) {
            return []
          }
        },
        set(value) {
          this.setDataValue('tags', JSON.stringify(value))
        },
      },
      autoMatchScores: {  // NOT included in offline version; this array matches tags item for item
        type: Sequelize.JSON,
        // null indicates it is based on a human submission
      },
      status: {
        type: Sequelize.ENUM(
          'none',  // no human submission yet, and nothing tagged
          'automatch',  // no human submission yet
          'unconfirmed',  // contains human submission, but contains at least some tags which are not confirmed strongly enough
          'confirmed'  // contains human submission and is strongly confirmed
        ),
        allowNull: false,
      },
      wordsHash,
      createdAt,
    },
    {
      indexes: [
        {
          fields: ['loc', 'wordsHash'],
          unique: true,
          name: 'loc_wordsHash',
        },
        { fields: ['loc', 'status'] },
        { fields: ['status'] },
        { fields: ['wordsHash'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,  // since rows are never updated, but rather destroyed and re-created
    },
  )

  ////////////////////////////////////////////////////////////////////

  // This table and the next used in the auto-tagging process
  // since we do now know the actual (copyrighted) words of the translations.

  // needed: none
  // changes often
  const WordHashesSetSubmission = global.connection.define(
    `${versionId}WordHashesSetSubmission`,
    {
      loc,
      wordsHash,
      createdAt,
    },
    {
      indexes: [
        {
          fields: ['wordsHash', 'loc'],
          unique: true,
          name: 'wordsHash_loc',
        },
        { fields: ['loc'] },
        { fields: ['embeddingAppId'] },
        { fields: ['createdAt'] },
      ],
      updatedAt: false,
    },
  )

  WordHashesSetSubmission.belongsTo(global.connection.models.embeddingApp, required)
  global.connection.models.embeddingApp.hasMany(WordHashesSetSubmission)

  //////////////////////////////////////////////////////////////////

  // needed: none
  // changes often
  const WordHashesSubmission = global.connection.define(
    `${versionId}WordHashesSubmission`,
    {
      wordNumberInVerse,
      hash,
      withBeforeHash: { ...wordComboHash },
      withAfterHash: { ...wordComboHash },
      withBeforeAndAfterHash: { ...wordComboHash },
    },
    {
      indexes: [
        {
          fields: [`${versionId}WordHashesSetSubmissionId`, 'wordNumberInVerse'],
          unique: true,
          name: `${versionId}WordHashesSetSubmissionId_wordNumberInVerse`,
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

  ////////////////////////////////////////////////////////////////////

}

module.exports = setUpVersionDataModel
