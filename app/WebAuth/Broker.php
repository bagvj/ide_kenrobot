<?php

namespace App\WebAuth;

class Broker
{

    /**
     * 用户中心认证URL
     * @var [type]
     */
    protected $url;

    /**
     * BrokerID
     * @var string
     */
    public $broker;

    /**
     * BrokerSecret
     * @var [type]
     */
    protected $secret;

    /**
     * 访问凭据（其实现在就是存在 sso_中的cookie）
     * @var string
     */
    public $token;

    /**
     * 用户信息
     * @var [type]
     */
    protected $userinfo;

    public function __construct($url = '', $broker = '' , $secret = '')
    {
        $url = env('SSO_URL');
        $broker = env('SSO_BROKER_ID');
        $secret = env('SSO_BROKER_SECRET');
        if (!$url) throw new \InvalidArgumentException("SSO server URL not specified");
        if (!$broker) throw new \InvalidArgumentException("SSO broker id not specified");
        if (!$secret) throw new \InvalidArgumentException("SSO broker secret not specified");

        $this->url = $url;
        $this->broker = $broker;
        $this->secret = $secret;

        if (isset($_COOKIE[$this->getCookieName()])) $this->token = $_COOKIE[$this->getCookieName()];
    }

    /**
     * 根据brokerId生成cookieName
     * @return [type] [description]
     */
    protected function getCookieName()
    {
        return 'sso_token_' . preg_replace('/[_\W]+/', '_', strtolower($this->broker));
    }

    /**
     * SessionID
     *  SSO-broker-token-校验和
     * @return [type] [description]
     */
    protected function getSessionId()
    {
        if (!isset($this->token)) return null;

        $checksum = hash('sha256', 'session' . $this->token . $this->secret);
        return "SSO-{$this->broker}-{$this->token}-$checksum";
    }

    /**
     * 生成Token Value
     * @return [type] [description]
     */
    public function generateToken()
    {
        if (isset($this->token)) return;

        $this->token = base_convert(md5(uniqid(rand(), true)), 16, 36);
        setcookie($this->getCookieName(), $this->token, time() + 3600, '/');
    }

    /**
     * 清空Token Value
     * @return [type] [description]
     */
    public function clearToken()
    {
        setcookie($this->getCookieName(), null, 1, '/');
        $this->token = null;
    }

    /**
     * 判断是否附加成功， Server <->broker
     * @return boolean [description]
     */
    public function isAttached()
    {
        return isset($this->token);
    }

    /**
     * 创建附加链接
     * @param  array  $params [description]
     * @return [type]         [description]
     */
    public function getAttachUrl($params = array())
    {
        $this->generateToken();

        $data = array_merge($_GET, array(
            'broker' => $this->broker,
            'token' => $this->token,
            'checksum' => hash('sha256', 'attach' . $this->token . $this->secret)
        ));

        return $this->url . "/attach?" . http_build_query($data + $params);
    }

    /**
     * 附加\ [ə'tætʃ]
     * @param  [type] $returnUrl [description]
     * @return [type]            [description]
     */
    public function attach($returnUrl = null)
    {
        if ($this->isAttached()) return;

        // if ($returnUrl === true) {
        //     $protocol = !empty($_SERVER['HTTPS']) ? 'https://' : 'http://';
        //     $returnUrl = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        // }

        $params = array('return_url' => $returnUrl);
        $url = $this->getAttachUrl($params);
        return $url;
    }

    protected function getRequestUrl($command, $params = array())
    {
        $params['sso_session'] = $this->getSessionId();
        return $this->url ."/$command?" . http_build_query($params);
    }

    /**
     * 将命令请求转发至SSO Server
     * @param  string $method  请求方法 get/post/delete
     * @param  string $command 命令
     * @param  array  $data    数据       
     * @return array          请求结果
     */
    protected function request($method, $command, $data = null)
    {
        if (!$this->isAttached()) {
            throw new \Exception('No token');
        }
        $url = $this->getRequestUrl($command, !$data || $method === 'POST' ? array() : $data);


        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Authorization: Bearer '. $this->getSessionID()));

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
        if ($httpCode == 403) {
            $this->clearToken();
            throw new \Exception($data['error'] ?: $response, $httpCode);
        }
        if ($httpCode >= 400) throw new \Exception($data['error'] ?: $response, $httpCode);

        return $data;
    }

    public function login($username = null, $password = null, $source = 'local')
    {
        if (!isset($username) && isset($_REQUEST['username'])) $username = $_REQUEST['username'];
        if (!isset($password) && isset($_REQUEST['password'])) $password = $_REQUEST['password'];

        $result = $this->request('POST', 'login', compact('username', 'password', 'source'));

        $this->userinfo = $result;

        return $this->userinfo;
    }

    /**
     * 根据 user_id 直接登录
     * @param  [type] $id     [description]
     * @param  [type] $source [description]
     * @return [type]         [description]
     */
    public function loginid($id, $source)
    {
        $result = $this->request('POST', 'loginid', compact('id', 'source'));
        $this->userinfo = $result;

        return $this->userinfo;
    }

    /**
     * 通过微信直接登录
     * @return [type] [description]
     */
    public function loginWeixin($login_key, $source = 'weixin')
    {
        $result = $this->request('POST', 'login', compact('login_key', 'source'));

        $this->userinfo = $result;

        return $this->userinfo;
    }


    /**
     * 退出
     * @return [type] [description]
     */
    public function logout()
    {
        $this->request('POST', 'logout', 'logout');
    }

    /**
     * 获取用户信息
     *
     * @return object|null
     */
    public function getUserInfo()
    {
        if (!isset($this->userinfo)) {
            $this->userinfo = $this->request('GET', 'userinfo');
        }

        return $this->userinfo;
    }

    /**
     * 例子： getUserinfo
     *       postUserInfo
     *
     * @param string $fn
     * @param array  $args
     * @return mixed
     */
    public function __call($fn, $args)
    {
        $sentence = strtolower(preg_replace('/([a-z0-9])([A-Z])/', '$1 $2', $fn));
        $parts = explode(' ', $sentence);

        $method = count($parts) > 1 && in_array(strtoupper($parts[0]), array('GET', 'DELETE'))
            ? strtoupper(array_shift($parts))
            : 'POST';
        $command = join('-', $parts);

        return $this->request($method, $command, $args);
    }

}
