var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
var messageCode = require('./common/messageCode');
const ApiException = require('./common/Exception');
const define = require('./common/define');
var connection = require('../connection');

const IS_DELETED_FAULSE = 0;

/**
 * アカウント登録
 */
router.post('/create_account', (req, res, next) =>{
  ;(async () => {
    try {
    //Emailチェック
    var emailCheck = await getInsertEmailCheck(req.body);

    if (emailCheck.length !== 0 ) {
      return new ApiException(res, messageCode.NOT_SET_ALREADY_SETTING);
    }

    //パスワードのハッシュ化
    var password = req.body.password;
    const saltRounds = 10; // ストレッチング回数
    password = await bcrypt.hash(password, saltRounds);

    await insertAccount(req.body, password);

    res.status(200).json({
      code : messageCode.SAVE_COMPLETED
    });
    } catch (error) {
      throw new ApiException(res,messageCode.SAVE_ERROR);
    }
  })().catch(next);
});

/**
 * ログイン
 */
router.post('/login', function(req, res, next) {
  ;(async () => {
    try {
      // メールアドレスでアカウント情報取得
      const result = await loginAccount(req.body);

      // ハッシュ化されたパスワードの確認
      const comparePassword =
        await bcrypt.compare(req.body.password, result[0].password);
      if (!comparePassword) {
        return new ApiException(res, messageCode.LOGIN_ERROR)
      }

      res.status(200).json(result[0]);
    } catch (err) {
      return new ApiException(res, messageCode.LOGIN_ERROR);
    }
  })().catch(next);
});

/**
 * Eメールの重複チェック(新規)
 */
async function getInsertEmailCheck(body){
  return new Promise((resolve, reject) => {
  var sql = 'SELECT email '
      + 'FROM tb_user WHERE email = ? '
      + 'AND is_deleted = ?;';
  var bindData = [body.email, define.IS_DELETED_OFF];
    connection.query(sql, bindData,(err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}
  
/**
 *新規アカウント登録
  */
async function insertAccount(body, password) {

  var insertData = [body.user_name, body.email,
                  password, new Date(), new Date()];

  return new Promise((resolve, reject) => {
    var insertSql = 'INSERT INTO tb_user( '
      + 'user_name, email, password, '
      + 'created_date, modified_date)'
      + 'values(?, ?, ?, ?, ?)';

    connection.query(insertSql, insertData,(err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

/**
 * メールアドレスでアカウント情報取得
 */
async function loginAccount(body) {

  var bindData = [body.email, IS_DELETED_FAULSE];

  return new Promise((resolve, reject) => {
    var sql = 'SELECT * '
      + 'FROM tb_user '
      + 'WHERE email = ? AND is_deleted = ?';

    connection.query(sql, bindData, (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

module.exports = router;