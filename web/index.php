<?php

$local = __DIR__ . '/../config/env-local.php';
if(file_exists($local)) {
    require($local);
}

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

$config = require(__DIR__ . '/../config/web.php');

(new yii\web\Application($config))->run();
