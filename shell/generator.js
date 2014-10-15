require('shelljs/global');
var colors = require('colors');
var arguments = process.argv.slice(2);


var generator = function (nameOfModule) {
  console.log(arguments);

  this.createRouter = function() {
    var file = './' + nameOfModule + "/router.js"
    cd('../services');
    cat('../shell/router_template.js').to(file)
    sed('-i', '@name', nameOfModule, file);
  }

  if (exec('./add_module.sh ' + nameOfModule).code !== 0) {
    echo('Error Adding Module!');
    exit(1);
  } else {
    console.log("Success!".green);
    this.createRouter();
  }
}

var destroyer = function (nameOfModule) {
  if (exec('./destroy_module.sh ' + nameOfModule).code !== 0) {
    echo('Error Adding Module!');
    exit(1);
  } else {
    console.log("Success!".green);
  }
}

functions = {
  g: generator,
  d: destroyer
}

try {
  functions[arguments[0]](arguments[1]);
} catch (err) {
  console.log(colors.red(err));
  console.log(arguments);
}
