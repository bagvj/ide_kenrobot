<?php

namespace App\WebAuth;

use Curl\Curl;
/**
* 代理类
*/
class ApiProxy
{

    const API_USERINFO = '/api/user/userinfo';
    const API_REGISTER = '/api/user/register';
    const API_VALIDATE = '/api/user/validate';
    const API_WEIXINSCAN = '/api/user/weixin/scanlogin';


    private $baseUrl = null;
    private $apiguard = null;
    private $apiCurl = null;


    function __construct($appId, $appSecret, $baseUrl = '')
    {
        $this->apiguard = new ApiGuard($appId, $appSecret);
        $this->apiCurl = new Curl();
        $this->baseUrl = env('SSO_BASE');
        if (!empty($baseUrl)) {
            $this->baseUrl = $baseUrl;
        }
    }

    /**
     * 请求
     * @param  [type] $url  [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function post($url, $data)
    {
        $url = $this->baseUrl.$url;
        $package = $this->apiguard->getSignaturePackage();
        $urlParam = http_build_query($package);
        $url .= strpos($url, '?') === false ? '?'.$urlParam : '&'.$urlParam;
        $result = $this->apiCurl->post($url, $data);
        if ($result != false) {
            $result = json_decode(json_encode($result), true);
        }
        return $result;
    }

    /**
     * 用户数据
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function userinfo($data)
    {
        $url = self::API_USERINFO;
        return $this->post($url, $data);
    }

    /**
     * 注册
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function register($data)
    {
        $url = self::API_REGISTER;
        return $this->post($url, $data);
    }

    /**
     * 验证
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function validate($data)
    {
        $url = self::API_VALIDATE;
        return $this->post($url, $data);   
    }

    /**
     * 微信扫码登录
     * @param  string $value [description]
     * @return [type]        [description]
     */
    public function weixinScan($data = '')
    {
        $url = self::API_WEIXINSCAN;
        return $this->post($url, $data);   
    }

}
