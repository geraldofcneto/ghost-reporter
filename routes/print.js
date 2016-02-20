var express = require('express');
var router = express.Router();
var phantom = require('phantom');
var Report = require('../models/').Report;
var handlebars = require('handlebars');

router.post('/', create);
router.get('/report/:reportId', printReport);

module.exports = router;

function create(req, res) {
  var template = req.body.template || '<H1>Template not found.</H1>';
  var data = req.body.data || {};

  var report = Report.create({ template: template, data: JSON.stringify(data) });

  report.then(function (report) {
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.open('http://localhost:' + (process.env.PORT || 3000) + '/print/report/' + report.dataValues.id, function (status) {
          page.set('paperSize', { format: 'A4' });
          var reportFileName = 'report' + report.dataValues.id + '.pdf';
          page.render(reportFileName, function () {
            console.log('Printed');
            res.download('report' + report.dataValues.id + '.pdf', 'report' + report.dataValues.id + '.pdf');
          });
        });
      });
    });
  });
}

function printReport(req, res) {
  var reportId = req.params.reportId;
  Report.findById(reportId).then(function (report) {
    var template = handlebars.compile(report.template);
    var html = template(JSON.parse(report.data));
    res.send(html);
  });
}