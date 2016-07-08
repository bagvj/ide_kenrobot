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

class ProjectController extends Controller {

    public function buildProject(Request $request) {
        $id = $request->input('id');
        $id = intval($id);
        $user_id = $request->input('user_id');
        $project = ProjectModel::find($id);

        if(!$project || $project['user_id'] != $user_id) {
            return response()->json(['status' => -1, 'message' => '非法请求']);
        }

        $project_data = json_decode($project->project_data);
        //代码的字节码
        $source = $project_data->software->source;
        //项目名字
        $project_name = $project->project_name;
        //主板类型
        $board_type = $project_data->board->board_type;
        //项目hash
        $hash = $project->hash;

        $path = "/tmp/build/$hash";
        if(!file_exists($path)) {
            mkdir($path, 0755, true);
        }
        $f = fopen($path . "/main.ino", "wb");
        fwrite($f, $source);
        fclose($f);

        $cmd = "sudo sh ../app/Build/build.sh $path $board_type $project_name 2>&1";
        $output = array();
        exec($cmd, $output, $status);
        if ($status == 0) {
            return response()->json(['status' => 0, 'message' => '编译成功', 'hash' => $hash, 'url' => "/project/download/$hash"]);
        } else {
            $start = 0;
            $end = 0;
            for($i = 0; $i < count($output); $i++) {
                $line = $output[$i];
                if(strpos($line, "in <module>") !== false) {
                    $start = $i;
                }
                if(strpos($line, "scons: ***") !== false) {
                    $end = $i;
                }
                $output[$i] = str_replace($path . "/src/", "", $line);
            }
            $filterOutput = array_merge(array_slice($output, $start + 1, $end - $start - 1), array_slice($output, $end + 2));

            return response()->json(['status' => $status, 'message' => '编译失败', 'hash' => $hash, 'output' => $filterOutput]);
        }
    }

    public function downloadProject(Request $request, $hash, $ext = "zip") {
        $project = ProjectModel::where('hash', $hash)->first()->toArray();
        if(!$project) {
            return abort(404);
        }

        $ext = "." . $ext;
        $filename = "/tmp/build/$hash/build$ext";
        $build_info = "/tmp/build/$hash/build.info";
        if(!file_exists($filename) || !file_exists($build_info) ) {
            return abort(404);
        }

        $file = fopen($build_info, "r");
        $build_name = trim(fgets($file));
        fclose($file);

        $download_name = $build_name.$ext;
        //允许跨域
        header('Access-Control-Allow-Origin:*'); 
        //返回的文件类型
        header("Content-type: application/octet-stream");
        //按照字节大小返回
        header("Accept-Ranges: bytes");
        //返回文件的大小
        header("Accept-Length: " . filesize($filename));
        //这里对客户端的弹出对话框，对应的文件名
        Header("Content-Disposition: attachment; filename=$download_name");
        //一次只传输4096个字节的数据给客户端
        //打开文件
        $file = fopen($filename, "r");
        $buffer = 4096;
        //判断文件是否读完
        while (!feof($file)) {
            //将文件读入内存, 每次向客户端回送4096个字节的数据
            echo fread($file, $buffer);
        }
        fclose($file);
    }

    /**
     * 保存项目
     */
    public function saveProject(Request $request) {
        $keys_required = array('project_name', 'user_id');
        $keys = array('project_name', 'user_id','project_intro','project_data','public_type');
        $input = $request->only($keys);

        $input['id'] = $request->input('id');
        $input['project_type'] = 'code';

        $is_update = !empty($input['id']);

        //验证数据
        if (!$is_update) {
            foreach ($keys as $key) {
                //是否缺少参数
                if (!isset($input[$key])) {
                    return response()->json(array('status' => -1, 'message' => "[$key]为必需字段"));
                }
                //必要参数是否为空值
                if (in_array($key, $keys_required) && empty($input[$key])) {
                    return response()->json(array('status' => -1, 'message' => "[$key]不能为空"));
                }
            }
        }

        $user = User::find($input['user_id']);
        if ($user == null) {
            return response()->json(['status' => -2, 'message' => "请登录后进行保存"]);
        }
        $input['uid'] = $user->uid;
        $input['author'] = $user->name;

        
        if ($is_update) {
            $project = ProjectModel::find($input['id']);
            if ($project == null) {
                return response()->json(['status' => -3, 'message' => '项目不存在']);
            }

            if ($project->user_id != $input['user_id']) {
                return response()->json(['status' => -5, 'message' => '没有该项目所有权']);
            }

            //只留下要修改的字段
            foreach ($input as $k => $val) {
                if (!isset($input[$k])) {
                    unset($input[$k]);
                }
            }

            $ret =  $project->fill($input)->save();

            if ($ret) {
                return response()->json(['status' => 0, 'message' => '保存成功', 'data' => ['project_id' => $project->id, 'hash' => $project->hash]]);
            }else{
                return response()->json(['status' => -4, 'message' => '保存失败']);
            }
        }else {
            $input['hash'] = $this->getHash();
            $project =  ProjectModel::create($input);
            if ($project == null) {
                return response()->json(['status' => -4, 'message' => '保存失败']);
            }
            return response()->json(['status' => 0, 'message' => '保存成功', 'data' => ['project_id' => $project->id,  'hash' => $project->hash]]);
        }
    }

    /**
     * 获取项目
     */
    public function getProject(Request $request) {
        $id = $request->input('id');
        $hash = $request->input('hash');
        $user_id = $request->input('user_id');
        $type = isset($id) ? 'id' : 'hash';

        if (empty($id) && empty($hash)) {
            return response()->json(['status' => -1, 'message' => '[id] or [hash]为必需字段']);
        }

        //传递默认参数
        $user = User::find($user_id);
        $uid = empty($user) ? 0 : $user->uid;

        if ($type == 'id') {
            $project =  ProjectModel::find($id);
        }else if ($type == 'hash') {
            $project = ProjectModel::where('hash', $hash)->first();
        }

        if ($project == null) {
            return response()->json(['status' => -2, 'message' => '没有相关的数据']);
        }

        //私密
        if ($user_id != $project->user_id) {
            if ($project->public_type == 0) { //私有
                return response()->json(['status' => -3, 'message' => '没有权限查看这个项目']);
            }else if ($project->public_type == 1) { //私有
                return response()->json(['status' => -4, 'message' => '该项目仅好友可见']);
            }
        }

        return response()->json(['status' => 0, 'message' => '获取成功', 'data' => $project->toArray()]);
    }
    
    /**
     * 获取项目列表
     */
    public function getProjects(Request $request) {
        $user_id = $request->input('user_id');
        $project_type = 'code';

        if (empty($user_id)) {
            return response()->json(['status' => -1, 'message' => '[user_id]为必需字段切类型为数字']);
        }


        $projectList = ProjectModel::where('user_id', $user_id)
            ->where('project_type',$project_type)->get();
        if (!empty($projectList) && $projectList->count() > 0) {
            return response()->json(['status' => 0, 'message' => '', 'data' => $projectList->toArray()]);
        }
        
        return response()->json(['status' => -2, 'message' => '没有相关的数据', 'data' => []]);
    }

    /**
     * 项目列表,对外接口
     */
    public function ProjectList(Request $request)
    {
		$uid = $request->input('uid');
		$page = $request->input('page');
		$pagesize = $request->input('pagesize');
		$page = !empty($page) ? intval($page) : 1;
		$pagesize = !empty($pagesize) ? intval($pagesize) : 3; 
		if ($page <= 0 || $pagesize <1 ) {
			return response()->json(['status' => -3, 'message' => '无效的页码数据']);
		}


		if (empty($uid)) {
			return response()->json(['status' => -1, 'message' => '[uid]为必需字段']);
		}
		$allowKeys = ['id','project_name', 'user_id', 'uid', 'author' ,'project_intro', 'public_type', 'hash', 'project_type'];
		$projectList = ProjectModel::where('uid', $uid)
			->orderby('updated_at','desc')
			->skip(($page-1)*$pagesize)
			->take($pagesize)
			->get($allowKeys);

		if (!empty($projectList) && $projectList->count() > 0) {
			$total = ProjectModel::where('uid', $uid)->count();
			return response()->json(['status' => 0, 'message' => '获取成功', 'data' => [
				'total' => $total, 
				'page' => $page,
				'pagesize' => $pagesize,
				'count' => $projectList->count(),
				'items' => $projectList->toArray()
			]]);
		}

		return response()->json(['status' => -2, 'message' => '没有相关的数据', 'data' => [
			'total' => 0, 
			'page' => $page,
			'pagesize' => $pagesize,
			'count' => 0,
			'items' => []
		]]);
    }

    /**
     * 删除项目
     * @param int id 项目ID
     */
    public function deleteProject(Request $request) {
        $id = $request->input('id');
        $id = intval($id);

        if (empty($id)) {
            return response()->json(['status' => -1, 'message' => '[id]为必需字段且类型为数字']);
        }

        $project = ProjectModel::find($id);

        if ($project == null) {
            return response()->json(['status' => -2, 'message' => '正在删除不存在的数据']);
        }

        //暂时不开放
        // if ($project->user_id != $request->input('user_id')) {
        //     return response()->json(['status' => -3, 'message' => '无权操作这个项目']);
        // }
        $ret = $project->delete();

        if ($ret) {
            return response()->json(['status' => 0, 'message' => '删除成功']);
        } else {
            return response()->json(['status' => -3, 'message' => '删除失败']);
        }

    }

    //生成短url
    //返回：一个长度为6的由字母和数组组成的字符串
    private function getHash($value = "") {
        $key = "HwpGAejoUOPr6DbKBlvRILmsq4z7X3TCtky8NVd5iWE0ga2MchSZxfn1Y9JQuF";

        $result = array();
        $time = time();
        $salt = md5(rand(10000, 99999));
        $md5 = md5($salt . $value . $time);

        for($i = 0; $i < 4; $i++) {
            $hex = 0x3FFFFFFF & intval(substr($md5, $i * 8, 8), 16);
            $out = '';
            for($j = 0; $j < 6; $j++) {
                $index = 0x0000003D & $hex;
                $out = $out . $key[$index];
                $hex = $hex >> 5;
            }
            $result[$i] = $out;
        }

        return $result[0];
    }

}
