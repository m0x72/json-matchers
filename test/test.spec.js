'use strict'

var matchers = require('../index.js');

// Jasmine tests

describe('matchers.expectJSONTypes', function(){
  it("matches 1-level objects", function() {
    var data = {
      key: "some val",
      key2: "bored",
      key3: 123
    }

    expect(matchers.expectJSONTypes(data, {})).toBe(true);
    expect(matchers.expectJSONTypes(data, {key2: String})).toBe(true);
    expect(matchers.expectJSONTypes(data, {key2: String, key3: Number})).toBe(true);
    expect(function(){
      matchers.expectJSONTypes(data, {key2: String, key3: String})
    }).toThrow();
  });

  it("matches 1-level objects with objects", function() {
    var data = {
      key: "some val",
      key2: "bored",
      key3: {}
    };

    expect(matchers.expectJSONTypes(data, {key3: Object()})).toBe(true);
    expect(function(){
      matchers.expectJSONTypes(data, {key3: {key31: Number}})
    }).toThrow();
  });


  it("matches 2-level objects", function() {
    var data = {
      key: "some val",
      key2: "bored",
      key3: {
        key31: 321,
        key32: "val"
      }
    };

    expect(matchers.expectJSONTypes(data, {key3: Object})).toBe(true);
    expect(matchers.expectJSONTypes(data, {key3: {key32: String}})).toBe(true);
    expect(function(){
      matchers.expectJSONTypes(data, {key3: {key32: Number}})
    }).toThrow();
    expect(matchers.expectJSONTypes(data, {key3: {key32: String, key31: Number}})).toBe(true);

  });

  it("if object exsists in collection, matches type", function(){

    var data = [
      {
        key: 1,
        key2: {
          key: "a",
          key2: "b",
          key3: "c"
        }
      },
      {
        key: 1,
        // key2: {
        //   key: "a",
        //   key2: "b"
        // }
      },
      {
        key: 1,
        // key2: {
        //   key: "a",
        //   key2: "b"
        // }
      }
    ];

    expect(matchers.expectJSONTypes(data, {key2: {key: String, key2: String}}, "?")).toBe(true);
    expect(function(){
      matchers.expectJSONTypes(data, {key2: {key: String, key4: String}}, "?").toThrow();
    });


    var data = [
      {
        key: 1,
        // key2: {
        //   key: "a",
        //   key2: "b",
        //   key3: "c"
        // }
      },
      {
        key: 1,
        // key2: {
        //   key: "a",
        //   key2: "b"
        // }
      },
      {
        key: 1,
        // key2: {
        //   key: "a",
        //   key2: "b"
        // }
      }
    ];

    expect(matchers.expectJSONTypes(data, {key2: {key: String, key2: String}}, "?")).toBe(true);

  });

  it("at least one objects in collection matches type", function(){
    var data = [
      {},
      {
        key: 1,
        key2: "String"
      },
      {
        key: "testme"
      }
    ];

    expect(matchers.expectJSONTypes(data, {key: String}, "+")).toBe(true);
    expect(function(){
      matchers.expectJSONTypes(data, {key2: Number}, "+").toThrow();
    });
    expect(matchers.expectJSONTypes(data, {}, "+")).toBe(true);
    expect(matchers.expectJSONTypes([{key: 123}], {}, "+")).toBe(true);
  });

  it("all objects in collection match Type", function(){
    var data = [
      {},
      {
        key: 1,
        key2: "String"
      },
      {
        key: "testme"
      }
    ];

    expect(function(){
      matchers.expectJSONTypes(data, {key: String}, "*").toThrow();
    });
    expect(function(){
      matchers.expectJSONTypes(data, {}, "*").toThrow();
    });

    data = [
      {
        key: 1,
        key2: "string"
      },
      {
        key: Infinity,
        key2: "a very long string"
      },
      {
        key: -Infinity,
        key2: ""
      }
    ]
    expect(matchers.expectJSONTypes(data, {key: Number, key2: String}, "*")).toBe(true);
  });

  it("matches any path combination (let hell break loose)", function(){
    var data = {
      key: {
        key: "String",
        key2: "Number"
      },
      key2: "Number",
      key3: [
        {
          key: 123123
        },
        {
          key: {
            key: [
              {
                something: -13231,
                more: "Can i go now?"
              }
            ]
          }
        }
      ]
    };

    expect(matchers.expectJSONTypes(data, {something: Number, more: String}, "key3.+.key.key.+")).toBe(true);
    expect(matchers.expectJSONTypes(data, {something: Number, more: String}, "+.+.key.key.*")).toBe(true);
    expect(function(){
      matchers.expectJSONTypes(data, {something: Number, more: String}, "+.*.key.key.*").toThrow();
    });

  });


});
