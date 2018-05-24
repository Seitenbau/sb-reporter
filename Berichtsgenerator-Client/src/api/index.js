
const defaultOptions = {
  credentials: process.env.REACT_APP_DEV ? 'include': 'same-origin',
}

function login (body) {
  return fetch('/login', Object.assign({}, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions))
}

function metadata(id) {
  return fetch(`/api/metadata/${id}`, Object.assign({}, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions))
  .then(res => res.json());
}

function save(id, body, user) {
  return fetch(`/api/metadata/${id}`, Object.assign({},{
    method: 'PUT',
    body: JSON.stringify(body),
    headers: new Headers({
      'X-CSRF-TOKEN': user['CSRF-TOKEN'],
      'content-type': 'application/json'
    }),
  }, defaultOptions));
}

function triggerImport(body) {
  return fetch(`/api/import`)
  .then((res) => res.json());
}

function metadataFromuser(id) {
  return fetch(`/api/metadata/all?uid=${id}`, Object.assign({}, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions)).then((res) => res.json())
}

function getApiInformation() {
  return fetch('/api/third-partys/', Object.assign({}, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions))
    .then((res) => res.json());
}

function getTemplateInformation() {
  return fetch('/api/genarate/templates', Object.assign({}, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions))
    .then((res) => res.json());
}
function getUsers() {
  return fetch('/api/users', Object.assign({}, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions))
  .then(res => res.json())
}
function startImport(body) {
  return fetch('/api/import', Object.assign({}, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions))
}
function startNew(body) {
  return fetch('/api/new', Object.assign({}, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'content-type': 'application/json'
    }),
  }, defaultOptions)).then((res) => {
    if(res.status !== 200) {
      throw new Error('Something went wrong...');

    } else {
      return res.json();
    }
  })
}

function newPage(id) {
  return fetch(`/api/new/${id}/page`, Object.assign({}, {
    method: 'POST',
    headers: new Headers({
      'content-type': 'text/plain'
    }),
  }, defaultOptions))
  .then((res) => res.text());
}

function genaratePDF(id, filename) {
  return fetch(`/api/genarate/${id}`, Object.assign({}, {
    method: 'POST',
    body: JSON.stringify({
      filename
    }),
    headers: new Headers({
      'Accept': 'application/pdf',
    }),
  }, defaultOptions))
  .then((res) => res.blob());
}

export {
  login,
  metadata,
  save,
  metadataFromuser,
  getApiInformation,
  getTemplateInformation,
  getUsers,
  startImport,
  startNew,
  newPage,
  genaratePDF,
}
