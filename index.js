'use strict';

var _ = require('lodash');
var assert = require('assert');


// matcher for (fuzzy) value matching
function testValues(data, values) {
  return _(values).every(function(value, attr) {
    if (typeof value === "object" && typeof data[attr] === "object") {
      return testValues(data[attr], value);
    }
    if (data[attr] !== value)
      throw new assert.AssertionError({message: "Expected attribute " + attr + " to be " + value + " but instead got " + data[attr] + " in " + JSON.stringify(data)});
    return true;
  });
}

// matcher for (fuzzy) type matching
function testTypes(data, types) {
  return _(types).every(function(type, attr) {
    // test for object/arrays
    if (typeof type === "object") {
      if (typeof data[attr] === "object") {
        return testTypes(data[attr], type);
      } else {
        throw new assert.AssertionError({message: "Types do not match. Expected object but got " + typeof data[attr] + " instead"});
      }
    }

    // test for primitve types
    if (typeof data[attr] !== typeof type()) {
     //  assert.fail("Types do not match");
      throw new assert.AssertionError({message: "Types do not match. Expected " + (typeof type()).toString() + " but got " + typeof data[attr] + " instead."})
     //  throw new assert.AssertionError({message: "Types do not match", actual: data[attr], expected: type(), operator: 'typeof actual === typeof expected()', stackStartFunction: testJSONPath});
    }
    return true;
  });
}




// Helper for testJSONPath
function _stripPath(path, segment) {
  function quoteReExp(str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  };
  var rExp = new RegExp("^"+quoteReExp(segment)+"\.?");
  return path.replace(rExp, "");
}

// Takes a value comparision function fCompare
function testJSONPath(fCompare, data, types, path) {

  path = path || "";

  var splitPath = path.split(".")
  switch(splitPath[0]) {
    case "" :
      //neglecting ".something" case

      // verify path (nothing following)
      if (splitPath[1])
        throw new assert.AssertionError({message: "Empty path segments must not be followed by further ones"});
      return fCompare(data, types);

    // one (/some) objects in an array (/collection)
    case "?" :
      var result =  _(data).some(function(data) {
        try {
          return testJSONPath(fCompare, data, types, _stripPath(path, splitPath[0]));
        } catch(e) {
          return false;
        }
      });
      if (!result)
        throw new assert.AssertionError({message: "Expected to match types " + JSON.stringify(types) + " for path " + path + " to any attribute of " + JSON.stringify(data) });
      break;

    // all objects in an array
    case "*" :
      var result = _(data).every(function(data) {
        try {
          return testJSONPath(fCompare, data, types, _stripPath(path, splitPath[0]));
        } catch(e) {
          return false;
        }
      });
      if (!result)
        throw new assert.AssertionError({message: "Expected to match types " + JSON.stringify(types) + " for path " + path + " to all attributes of " + JSON.stringify(data) });
      break;

    // literal path segment
    default :
      if (!data[splitPath[0]])
        throw new assert.AssertionError({message: "Path segment " + splitPath[0] + " not found in given object"});
      return testJSONPath(fCompare, data[splitPath[0]], types, _stripPath(path, splitPath[0]));
      break;
  }

  return true;
}

module.exports = {
  expectJSONTypes : function(data, types, path){
    if (typeof data === "string")
      data = JSON.parse(data)
    return testJSONPath(testTypes, data, types, path);
  },
  expectJSON: function(data, types, path){
    if (typeof data === "string")
      data = JSON.parse(data)
    return testJSONPath(testValues, data, types, path);
  }
};
