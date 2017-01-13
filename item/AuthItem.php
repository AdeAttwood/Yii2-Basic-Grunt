<?php

namespace app\item;

class AuthItem extends \yii\rbac\Item
{
    const ROLE_DEVELOPER = 'Developer';
    const ROLE_ADMIN     = 'Admin';
    const ROLE_MEMBER    = 'Member';
}
