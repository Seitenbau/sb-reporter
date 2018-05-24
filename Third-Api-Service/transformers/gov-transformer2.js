
module.exports = function (transformer, data) {
  // define a schema
  const schema = {
    'personen':  {
      'name': '[].name',
      'vorname': "[].vorname"
    }
  };
  // add schema
  transformer.setSchema(schema);
  // transform data

  return transformer.map(data)
}
