var express = require('express');
var router = express.Router();
var messageCode = require('./common/messageCode');
const ApiException = require('./common/Exception');
const define = require('./common/define');
var connection = require('../connection');

/**
 * 投稿一覧取得
 */
router.get('/', (req, res, next) =>{
  ;(async () => {
    try {
      var posts = await getPosts();
      res.render('post', {posts:posts});
    } catch (error) {
        throw new ApiException(res,messageCode.SAVE_ERROR);
    }
  })().catch(next);
});

/**
 * 投稿一覧取得
 */
router.post('/', (req, res, next) =>{
  ;(async () => {
    try {
      //後からsessionが持っているuserIdに変更する
      var userId = 10;
      await insertPostData(req.body, userId)
      res.redirect('post');
    } catch (error) {
        throw new ApiException(res,messageCode.SAVE_ERROR);
    }
  })().catch(next);
});

/**
 * 投稿全取得
 */
async function getPosts() {
  return new Promise((resolve, reject) => {
  var sql = 'SELECT T1.id, T1.title, T1.message, T1.post_date, T2.user_name '
      + 'FROM tb_board AS T1 INNER JOIN tb_user AS T2 '
      + 'ON T1.user_id = T2.user_id WHERE T1.is_deleted = ?;';
  var bindData = [define.IS_DELETED_OFF];
    connection.query(sql, bindData,(err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

/**
 * 新規投稿
  */
 async function insertPostData(body, userId) {

  var insertData = [userId, body.title, body.message,
                    new Date(), new Date(), define.IS_DELETED_OFF];

  return new Promise((resolve, reject) => {
    var insertSql = 'INSERT INTO tb_board( '
      + 'user_id, title, message, '
      + 'post_date, modified_date, is_deleted)'
      + 'values(?, ?, ?, ?, ?, ?)';

    connection.query(insertSql, insertData,(err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

module.exports = router;