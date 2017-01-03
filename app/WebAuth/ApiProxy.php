<?php

namespace App\WebAuth;


/**
* 代理类
*/
class ApiProxy
{

    const API_USERINFO = '/api/user/userinfo';
    const API_REGISTER = '/api/user/register';
    const API_VALIDATE = '/api/user/validate';
    const API_WEIXINSCAN = '/api/user/weixin/scanlogin';


    protected $appId = null;
    protected $appSecret = null;
    protected $baseUrl = null;
    protected $apiCurl = null;


    function __construct($appId, $appSecret, $baseUrl)
    {

        if (!$appId) throw new \InvalidArgumentException("AppID not specified");
        if (!$appSecret) throw new \InvalidArgumentException("AppSecret not specified");
        if (!$baseUrl) throw new \InvalidArgumentException("APP BASEURL not specified");

        $this->appId = $appId;
        $this->appSecret = $appSecret;
        $this->baseUrl = $baseUrl;
    }

    public function userinfo($data)
    {
        return $this->post(self::API_USERINFO, $data);
    }

    public function register($data)
    {
        return $this->post(self::API_REGISTER, $data);
    }

    public function validate($data)
    {
        return $this->post(self::API_VALIDATE, $data);   
    }

    public function weixinScan()
    {
        return $this->post(self::API_WEIXINSCAN, []);   
    }


    protected function getSignaturePackage()
    {
        $timestamp = time();
        $nonce = $this->getNonce();
        $signature = $this->getSignature($this->appId, $this->appSecret, $nonce, $timestamp);
        $signPackage = array(
            'appId' => $this->appId,
            'timestamp' => $timestamp,
            'nonce' => $nonce,
            'signature' => $signature,
        );
        return $signPackage;
    }

    protected function post($command, $data = null)
    {
        try {
            return $this->request('POST', $command, $data);
        } catch (\Exception $e) {
            return array('status' => -10, 'message' => $e->getMessage());
        }
    }

    protected function getRequestUrl($command)
    {
        return $this->baseUrl.$command.'?'.http_build_query($this->getSignaturePackage());
    }


    /**
     * 将命令请求转发至SSO Server
     * @param  string $uri  请求方法 get/post/delete
     * @param  string $command 命令
     * @param  array  $data    数据       
     * @return array          请求结果
     */
    protected function request($method, $command, $data = null)
    {
        $url = $this->getRequestUrl($command);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));

        if ($method === 'POST' && !empty($data)) {
            $post = is_string($data) ? $data : http_build_query($data);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        }

        $response = curl_exec($ch);
        if (curl_errno($ch) != 0) {
            $message = 'Server request failed: ' . curl_error($ch);
            throw new \Exception($message);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        list($contentType) = explode(';', curl_getinfo($ch, CURLINFO_CONTENT_TYPE));

        if ($contentType != 'application/json') {
            $message = 'Expected application/json response, got ' . $contentType;
            throw new \Exception($message);
        }

        $data = json_decode($response, true);
        if ($httpCode >= 400) {
            throw new \Exception($data['status'].$data['message'] ?: $response, $httpCode);
        }

        return $data;
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