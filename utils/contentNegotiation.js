const xml2js = require('xml2js');
const jsonToPlainText = require('json-to-plain-text');
const json2html = require('json-to-html');

const jsToXml = (data) => {
  const xmlToJsBuilder = new xml2js.Builder();
  return xmlToJsBuilder.buildObject(data);
};

const jsonToTextPlain = (data) =>
  jsonToPlainText.toPlainText(JSON.parse(JSON.stringify(data)));

const jsonToHTML = (data) => json2html(JSON.parse(JSON.stringify(data)));

const jsToJson = (data) => JSON.parse(JSON.stringify(data));

exports.serveData = function (data, statusCode, req, res, next) {
  let dataToServe = {};
  if (data instanceof Array) {
    const dataField = [...data];

    dataToServe.status = 'success';
    dataToServe.results = dataField.length;
    dataToServe.data = dataField;
  } else {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const dataField = { ...data };

    dataToServe.status = 'success';
    dataToServe.data = dataField;
  }

  if (req.headers.accept && req.headers.accept === 'application/xml') {
    dataToServe = jsToXml(dataToServe);
    res.setHeader('Content-Type', 'application/xml'); // to XML
  } else if (req.headers.accept && req.headers.accept === 'text/plain') {
    dataToServe = jsonToTextPlain(dataToServe);
    res.setHeader('Content-Type', 'text/plain'); // to plain text
  } else if (req.headers.accept && req.headers.accept === 'text/html') {
    dataToServe = jsonToHTML(dataToServe); // to HTML
    res.setHeader('Content-Type', 'text/html');
  } else {
    dataToServe = jsToJson(dataToServe); // to JSON
    res.setHeader('Content-Type', 'application/json');
  }

  res.status(statusCode).send(dataToServe);
};
