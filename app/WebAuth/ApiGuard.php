<?php

namespace App\WebAuth;

use Curl\Curl;
use Log;
/**
* 第三方插件
*/
class ApiGuard
{

    private $appId = null;
    private $appSecret = null;

    function __construct($appId, $appSecret)
    {
        $this->appId = $appId;
        $this->appSecret = $appSecret;
    }

    /**
     * 获取签名包
     * @return  [description]
     */
    public function getSignaturePackage()
    {
        $timestamp = time();
        $nonce = $this->getNonce();
        $signature = $this->getSignature($this->appId, $this->appSecret, $nonce, $timestamp);
        $signPackage = [
            'appId' => $this->appId,
            'timestamp' => $timestamp,
            'nonce' => $nonce,
            'signature' => $signature,
        ];
        return $signPackage;
    }

    /**
     * 签名
     * @return string 签名数据
     */
    public function getSignature($appId, $appSecret, $nonce, $timestamp)
    {
        $input = compact('appId', 'appSecret', 'nonce', 'timestamp');
        ksort($input,SORT_STRING);
        return sha1(implode($input));
    }

    /**
     * 获取随机字符串
     *
     * @return string
     */
    protected function getNonce()
    {
        return uniqid('krbt_');
    }

}