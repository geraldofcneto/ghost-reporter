var express = require('express');
var router = express.Router();
var phantom = require('phantom');
var Report = require('../models/').Report;

router.get('/', create);
router.get('/google', printGoogle);

module.exports = router;

function create(req, res) {
  var template = req.body.template || '<H1>Template not found.</H1>';
  var data = req.body.data || {};

  var report = Report.create({ template: template, data: JSON.stringify(data) });

  report.then(function (report) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open('', function (status) {
        console.log('JS Evaluated');

        page.includeJs('http://localhost:'+ (process.env.PORT || 3000) + '/js/' /* + templateId */);

        page.set('paperSize', { format: 'A4' });

        page.render('file.pdf', function () {
          console.log('Printed');
          res.download('file.pdf', 'file.pdf');
        });
      });
    });
  });
}

function printGoogle(req, res) {

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.set('paperSize', { format: 'A4' });
      page.open("http://www.google.com", function (status) {
        page.render('file.pdf', function () {
          console.log('Printed');
        });
      });
    });
  });

  res.download('file.pdf', 'file:///file.pdf');
}
