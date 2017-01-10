<?php

$db = [];

if (YII_ENV_DEV) {
    $db = [
        'class'    => 'yii\db\Connection',
        'dsn'      => 'mysql:host=localhost;dbname=yii2_basic',
        'username' => 'root',
        'password' => 'root',
        'charset'  => 'utf8',
    ];
} else {
    $db = [
        'class'    => 'yii\db\Connection',
        'dsn'      => 'mysql:host=localhost;dbname=live_db_name',
        'username' => 'live_sql_user',
        'password' => 'live_sql_password',
        'charset'  => 'utf8',
    ];
}

return $db;