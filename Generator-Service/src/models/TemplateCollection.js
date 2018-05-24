const Template = require('./Template');

var fs = require('fs');
var path = require('path');

/**
* TemplateCollection provids all Templates defined and servs functions on that
*/
class TemplateCollection {
  constructor(templates) {

    const dir = path.resolve(__dirname, '../../templates')
    this.templates = fs.readdirSync(dir)
      .filter((file) => file.indexOf('.html') > -1)
      .map((file) => new Template({
        name: file,
        id: file.replace('.html', '').toLowerCase(),
        html: fs.readFileSync(path.resolve(dir, file), 'utf8'),
        css: path.resolve(dir, file.replace('.html', '.css'))
      }));
  }

  /**
  * returns an api-obejct
  * @param [id] STRING|UNDEFINED an id of one defined api ore undefined
  * @return JSON defined api-object ore dafualt-api-object
  */
  get(id) {
    if(this.length() === 0 || typeof id === 'undefined') {
      return {
        html: '<div><i>Fehler:<i>Es sind keine Vorlagen registriert oder es wurde vergessen eine id anzugeben</div>'
      };
    }
    return this.templates.filter((api) => api.id === id)[0];
  }
/**
* @return Array of Templates
*/
  getAll() {
    return JSON.parse(JSON.stringify(this.templates))
  }

  /**
  * returns an dafualt-api-object for unregular use
  * @param api JSON api-object to be merged above the default object
  * @return JSON dafualt-api-object
  */
  defaultApi(api = {}) {
    return new Api(Object.assign({}, api, { baseURL: '', id: null }));
  }

  last() {
    return this.templates[this.templates.length - 1];
  }
  first() {
    return this.templates[0];
  }
  length() {
    return this.templates.length;
  }
}

module.exports = TemplateCollection;
