exports.default = ()=> {
  const apiConfig = {
    env:'dev',
    API_KEY:'SOME_RANDOM_STRING_SHARED_WITH_SPFX_PLUGIN_OR_MS_FLOW',
    sitePaths:{
      'sp_dev' : 'WHERE_TO_SAVE_JSON_SCHEMA_FILES_ON_FRONTEND_SERVER',
      'dev': 'WHERE_TO_SAVE_JSON_SCHEMA_FILES_ON_FRONTEND_SERVER_LOCAL'
    }
  };
  
  return apiConfig;
};
