<?php

use app\item\AuthItem;
use yii\db\Migration;
use yii\base\InvalidConfigException;
use yii\rbac\DbManager;

class m170111_194806_add_roles extends Migration
{

    /**
     * @throws yii\base\InvalidConfigException
     * @return DbManager
     */
    protected function getAuthManager()
    {
        $authManager = Yii::$app->getAuthManager();
        if (!$authManager instanceof DbManager) {
            throw new InvalidConfigException('You should configure "authManager" component to use database before executing this migration.');
        }
        return $authManager;
    }

    /**
     * @return bool
     */
    protected function isMSSQL()
    {
        return $this->db->driverName === 'mssql' || $this->db->driverName === 'sqlsrv' || $this->db->driverName === 'dblib';
    }

    public function up()
    {

        $authManager = $this->getAuthManager();
        $this->db = $authManager->db;

        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->batchInsert(
            $authManager->itemTable,
            [
                'name',
                'type',
                'description',
                'created_at',
                'updated_at'
            ],
            [
                [
                    AuthItem::ROLE_DEVELOPER,
                    AuthItem::TYPE_ROLE,
                    'Developer of the website',
                    Yii::$app->formatter->asTimestamp('now'),
                    Yii::$app->formatter->asTimestamp('now'),
                ],
                [
                    AuthItem::ROLE_ADMIN,
                    AuthItem::TYPE_ROLE,
                    'Admin of the website',
                    Yii::$app->formatter->asTimestamp('now'),
                    Yii::$app->formatter->asTimestamp('now'),
                ],
                [
                    AuthItem::ROLE_MEMBER,
                    AuthItem::TYPE_ROLE,
                    'Member of the website',
                    Yii::$app->formatter->asTimestamp('now'),
                    Yii::$app->formatter->asTimestamp('now'),
                ]
            ]
        );
    }

    public function down()
    {
        echo "m170111_194806_add_roles cannot be reverted.\n";

        return false;
    }
}
