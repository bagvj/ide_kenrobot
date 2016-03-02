<?php

namespace App\WebAuth;
/**
* 
*/
class Helper
{
    /**
     * 加密kenrobot_id
     */
    public static function encryptKenrobotId($kenrobot_id)
    {
        $kenrobot_id = intval($kenrobot_id);
        $sfx = trim(sha1(trim($kenrobot_id.'ken_token911')));
        return $kenrobot_id.'|'.$sfx;
    }

    /**
     * 解密
     * 这里解密的说法不准确，其实只是校验了一下，并没有用真正的解密算法
     */
    public static function decryptKenrobotId($kenrobot_string)
    {
        if (empty($kenrobot_string)) {
            return null;
        }

        list($kenrobot_id, $sfx) = explode('|', $kenrobot_string, 2);
        if (empty($kenrobot_id) || empty($sfx)) {
            return null;
        }
        $kenrobot_id = intval($kenrobot_id);
        $sfx_valid = trim(sha1(trim($kenrobot_id.'ken_token911')));
        if ($sfx_valid == $sfx) {
            return $kenrobot_id;
        }
        return null;
    }
}