/*
  An example of the proposed schema for each service. Each service would have a manifest file that defines the the service, its functions, input/output and source language.

  In order to add a new service to the server, you must write a manifest file according to a predetermined schema.

  This manifest is in JSON because it can be get stored in MONGO.DB, easily parsed/hashed in javascript, has less code but better functionality than an XML, and it has better support for arrays.

  Each manifest would include information about the language to generate the controller and server class methods. The input data is to formally document the functions inputs and outputs in order to assets if it meets requirement or can pipe its output into another function.

  If a user wants to add a new service to the application, the user must write a manifest.json. The user can then use the generator to scaffold:

    - new service directory
    - a router.js file within the directory it
    - unfinished classes in the specified language of the job. This is to allow easy integration between application and new codebase.
    - html/css/javascript templates according to the specified inputs (IE templates for form generation)
    - templates for outputs (IE templates to display the service output).
    - A set of unit tests to run according to the JSON specification using 'jasmine'. These can be found in the 'spec' folder.
*/

module.exports = {
  "yahoo": {
    "historical": require('./historical/manifest');
  }
}