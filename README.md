# json-matchers

Quick and simple set of functions to test (json) objects for value and/or types

## Functions

### expectJSONTypes
expectJSONTypes(data, types, path)

- data: Object or JSON string
- types: Object of types to test against
- path: (optional) *String* Path to the types Object
  - Path is '.' seperated and may also contain either:
    - '+': to match an object in a collection (array/object) at least once
    - '*': to match all objects in a collection
    - '?': to match an object in a collection only if the matching types keys (level1 keys check only) exsist.


### expectJSONValues
expectJSONValues(data, values, path)

- data: Object or JSON string
- values: Object of values to test against
- path: (optional) *String* Path to the types Object
  - Path is '.' seperated and may also contain either:
    - '+': to match an object in a collection (array/object) at least once
    - '*': to match all objects in a collection
    - '?': to match an object in a collection only if the matching types keys (level1 keys check only) exsist.

## Examples
see *test.spec.js*

## Todos
Clean up and clarify `?`, `+`, `-` matcher logic (esp. `?`).

## Licencse
MIT
