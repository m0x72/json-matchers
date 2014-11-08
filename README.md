# json-matchers

Quick and simple set of functions to test (json) objects for value and/or types

## Functions

### expectJSONTypes
expectJSONTypes(data, types, path)

- data: Object or JSON string
- types: Object of types to test against
- path: (optional) *String* Path to the types Object
  - Path is '.' seperated and may also contain either:
    - '?': to match any object in a collection (array/object)
    - '*': to match all objects in a collection


### expectJSONValues
expectJSONValues(data, values, path)

- data: Object or JSON string
- values: Object of values to test against
- path: (optional) *String* Path to the types Object
  - Path is '.' seperated and may also contain either:
    - '?': to match any object in a collection (array/object)
    - '*': to match all objects in a collection

## Examples
see *test.spec.js*

## Licencse
MIT
