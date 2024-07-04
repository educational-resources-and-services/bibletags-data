module.exports = () => {

  process.env.STAGE = process.env.STAGE || `dev`

  const envVarsByStage = {

    dev: {

      LOCAL: true,

    },

    staging: {

      LOCAL: "",
      AUTH_SITE_ID: "2",
      AUTH_DOMAIN: "auth.staging.bibletags.org",
      AWS_DOWNLOADS_BUCKET: "none",

      RDS_HOST: "group-staging.cmrypjnyrjea.us-east-1.rds.amazonaws.com",
      RDS_DATABASE: "BibleTags",

    },

    production: {

      LOCAL: "",
      AUTH_SITE_ID: "2",
      AUTH_DOMAIN: "auth.bibletags.org",
      AWS_DOWNLOADS_BUCKET: "downloads.bibletags.org",

      RDS_HOST: "group-production.cmrypjnyrjea.us-east-1.rds.amazonaws.com",
      RDS_DATABASE: "BibleTags",

    },

  }

  for(let key in envVarsByStage[process.env.STAGE]) {
    process.env[key] = envVarsByStage[process.env.STAGE][key]
  }

}