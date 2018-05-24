
module.exports = function (transformer, data) {
  // define the schema
  const schema = {
    bereiche: {
      code: '[].stadtbereich_code',
      stadt: '[].stadtbereich_bezeichnung',
      einwohner: '[].einwohnerzahl',
      bevoelkerungsdichte: '[].bevoelkerungsdichte'
    }
  }
  // add schema
  transformer.setSchema(schema);
  // transform data
  // return transformer.map(data).bereiche; //.bereiche.filter((b) => b.bevoelkerungsdichte < 1000);

  return {
    title: '',
    headline: 'fetched from an External Api',
    keys: ['titel', 'name', 'datum', 'subject'],
    documents: [
      {
        'titel': 'Bericht 1',
        'author': 'Lukas Ochmann',
        'datum': new Date(Date.now()),
        'subject': 'Ausbildungsbericht'
      },
      {
        'titel': 'Bericht 2',
        'author': 'Lukas Ochmann',
        'datum': new Date(Date.now()),
        'subject': 'Ausbildungsbericht'
      },
      {
        'titel': 'Bericht 3',
        'author': 'Lukas Ochmann',
        'datum': new Date(Date.now()),
        'subject': 'Ausbildungsbericht'
      }
    ]
  }
}
