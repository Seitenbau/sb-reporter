
module.exports = function (transformer, data) {
  // define the schema
  const schema = {
    'test1': 'a',
    'test2': 'b',
    'test3': 'c'
  }
  // add schema
  transformer.setSchema(schema);
  // transform data
  return transformer.map(data);
}
