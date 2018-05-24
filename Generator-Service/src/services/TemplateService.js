const mustache = require('mustache');
const Html = require('../models/Html');

module.exports = class TemplateService {
  constructor() {

  }

  render(template, model) {
    return new Html(model.documents
      .map((doc) => {
        return mustache.render(
          template.html,
          Object.assign(
            {},
            { metadata: model },
            { page: doc }
          )
        )
      }
      ), template.css);
  }


}
