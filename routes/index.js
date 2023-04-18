var express = require('express');
var router = express.Router();
var connection = require('../connection');

// /* GET home page. */
router.get('/get', function(req, res, next) {
  console.log('aaa');
  connection.connect();
  console.log(connection)
  connection.query(
    'SELECT * FROM tb_user',
    (error, results) => {
      console.log(results)
    }
  );
  
  connection.end();
  // res.render('index', { title: 'sakumatatsuya' });
  res.render('top');
});

module.exports = router;
