var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/pk', function(req, res) {
  res.send('ho pk');
});

module.exports = router;
