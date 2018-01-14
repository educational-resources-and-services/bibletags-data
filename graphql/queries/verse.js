module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    const [ verseLoc, version, invalidExtra ] = id.split('-')
    const model = models[`${version}Verse`]

    if(invalidExtra !== undefined) {
      throw(new Error('Invalid id.'))
    }

    if(!model) {
      throw(new Error('Invalid version indicated in id.'))
    }

    if(!verseLoc.match(/^[0-9]{8}$/)) {
      throw(new Error('Invalid verse location indicated in id.'))
    }

    return model.findById(verseLoc).then(verse => !verse ? null : ({
      id: `${verse.id}-${version}`,
      usfm: verse.usfm,
    }))

  }
}