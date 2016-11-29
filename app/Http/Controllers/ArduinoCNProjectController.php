<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use Auth;
use DB;
use Illuminate\Http\Request;
use ZipArchive;
use Curl\Curl;
use Session;
use App\Project\Project as ProjectModel;
use App\Util\Tools;

class ArduinoCNProjectController extends Controller {

    public function save(Request $request)
    {
        if (!$request->has('appId')) {
            return $this->apiReturn(-1, '未设置AppID');
        }

        $appId = $request->input('appId');
        if ($appId != 'arduinocn') {
            return $this->apiReturn(-2, '无效的appId');
        }
        $appSecret = 'aEZSHT62Udid';
        $nonce = $request->input('nonce');
        $timestamp = $request->input('timestamp');
        $signature = $request->input('signature');

        $checksignature = $this->getSignature($appId, $appSecret, $nonce, $timestamp);

        if ($signature != $checksignature) {
            return $this->apiReturn(-3, '签名错误');
        }


        if (! $request->has('uid')) {
            return $this->apiReturn(-4, '无效的用户');
        }

        if (! $request->has('sourcecode')) {
            return $this->apiReturn(-5, '[sourcecode] 不能为空');
        }

        $uid = $request->input('uid');
        $sourcecode = $request->input('sourcecode');
        $input = array();
        $input['project_name'] = $request->has('project_name') ? $request->input('project_name') : '插件代码_'.date('Y-m-d_H_i_s');
        $input['user_id'] = 0;
        $input['uid'] = 3000000 + intval($uid);
        $input['author'] = $request->has('author') ? $request->input('author') : 'arduinocn_user_'.$uid;
        $input['public_type'] = 0; // 默认私有
        $input['project_intro'] = '插件代码_'.date('Y-m-d_H_i_s');
        $input['project_data'] = $this->buildProject($sourcecode);
        $input['hash'] = Tools::getHash();

        $project =  ProjectModel::create($input);
        if ($project == null) {
            return response()->json(['status' => -4, 'message' => '保存失败']);
        }

        return response()->json(['status' => 0, 'message' => '保存成功', 'data' => ['project_id' => $project->id,  'hash' => $project->hash]]);
    }

    public function buildProject($sourcecode)
    {
        $project_data = [];

        $project_data['board'] = [
            'id' => 1,
            'name' => 'ArduinoUNO',
            'board_type' => 'uno',
        ];

        $project_data['hardware'] = [
            'model' => [
                'nodeDataArray' => [
                    [
                        'type' => 'board',
                        'name' => 'ArduinoUNO',
                        'key'  => 'ArduinoUNO_'.time(),
                        'varName' => '',
                        'location' => "0 0",
                    ],
                ],
                'linkDataArray' => [],
                'scale' => 1
            ],
            'componentCounts' => [],
        ];

        $project_data['software'] = [
            'libraries' => [],
            'source'    => $sourcecode,
        ];
        
        return json_encode($project_data, JSON_UNESCAPED_UNICODE);
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
     * 返回指定格式的代码
     * @param  [type] $status  [description]
     * @param  [type] $message [description]
     * @param  [type] $data    [description]
     * @return [type]          [description]
     */
    protected function apiReturn($status, $message, $data = null)
    {
        if (isset($data)) {
            return response()->json(compact('status', 'message', 'data'), JSON_UNESCAPED_UNICODE);
        } else {
            return response()->json(compact('status', 'message'), JSON_UNESCAPED_UNICODE);
        }
    }
    
 

}
