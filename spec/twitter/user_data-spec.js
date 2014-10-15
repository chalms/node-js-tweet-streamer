var request = require('request'),
UserData = require('../user_data.js');
describe('UserData', function () {
  json = {
    "user": {
      "user_id": "123232"
    },
    "collection":"user-id"
  }
  it('should return the user information', function () {
    var k;
    UserData.show(json["user"], "user-id", function (result) {
      k = result;
      console.log("below is returned result");
      console.log(result);
    });
    expect(k).toEqual("{ status: 200}");
  });
});

describe('UserData', function () {
  json = {
    "user": {
      "screen_name": "offportal"
    },
    "collection":"screen-name"
  }
  var k;
  it('should return the user information', function () {
    UserData.show(json["user"], "screen-name", function (result){
      k = result;
      console.log("below is returned result");
      console.log(result);
    });
    expect(k).toEqual("{ status: 200}");
  });
});
