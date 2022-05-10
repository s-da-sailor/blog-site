// DEPENDENCIES
const xml2js = require('xml2js');
const jsonToPlainText = require('json-to-plain-text');
const json2html = require('json-to-html');

// DATA CONVERSION METHODS
exports.jsToXml = (data) => {
  const xmlToJsBuilder = new xml2js.Builder();
  return xmlToJsBuilder.buildObject(data);
};

exports.jsonToTextPlain = (data) =>
  jsonToPlainText.toPlainText(JSON.parse(JSON.stringify(data)));

exports.jsonToHTML = (data) => json2html(JSON.parse(JSON.stringify(data)));

// CONTENT NEGOTIATION METHOD
exports.serveData = function (data, statusCode, req, res, next) {
  const dataField = JSON.parse(JSON.stringify(data));
  let dataToServe = {};
  dataToServe.status = 'success';
  if (dataField instanceof Array) {
    dataToServe.results = dataField.length;
  }
  dataToServe.data = dataField;

  if (req.headers.accept && req.headers.accept === 'application/xml') {
    dataToServe = exports.jsToXml(dataToServe);
    res.setHeader('Content-Type', 'application/xml'); // to XML
  } else if (req.headers.accept && req.headers.accept === 'text/plain') {
    dataToServe = exports.jsonToTextPlain(dataToServe);
    res.setHeader('Content-Type', 'text/plain'); // to plain text
  } else if (req.headers.accept && req.headers.accept === 'text/html') {
    dataToServe = exports.jsonToHTML(dataToServe); // to HTML
    res.setHeader('Content-Type', 'text/html');
  } else {
    res.setHeader('Content-Type', 'application/json');
  }

  res.status(statusCode).send(dataToServe);
};
