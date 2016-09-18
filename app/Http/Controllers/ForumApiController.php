<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Project\Project as ProjectModel;

class ForumApiController extends Controller
{
   /**
     * 项目列表
     * @return [type] [description]
     */
    public function projectList()
    {
        
    }

    /**
     * 获取项目数据
     * @return [type] [description]
     */
    public function projectInfo(Request $request)
    {
        $id = $request->input('id');
        $hash = $request->input('hashcode');
        $user_id = $request->input('user_id');
        $type = isset($id) ? 'id' : 'hashcode';

        if (empty($id) && empty($hash)) {
            return response()->json(['status' => -1, 'message' => '[id] or [hashcode]为必需字段'])->setCallback($request->input('callback'));
        }

        if ($id != 146 && $hash != 'Yl6UH6') {
            return response()->json(['status' => -2, 'message' => '没有相关数据'])->setCallback($request->input('callback'));
        }

        if ($type == 'id') {
            $project =  ProjectModel::find($id);
        }else if ($type == 'hashcode') {
            $project = ProjectModel::where('hash', $hash)->first();
        }

        if ($project == null) {
            return response()->json(['status' => -2, 'message' => '没有相关的数据'])->setCallback($request->input('callback'));
        }

        $project->project_data = json_decode($project->project_data, true);
        

        $data = $project->toArray();
        // if (!empty($data['project_data']['software']['source'])) {
        //     $data['project_data']['software']['source'] = nl2br($data['project_data']['software']['source']);
        // }
        
        $forumdata = array();
        $forumdata['id'] = $data['id'];
        $forumdata['project_name'] = $data['project_name'];
        $forumdata['hash'] = $data['hash'];
        $forumdata['author'] = $data['author']; 
        $forumdata['source'] = $data['project_data']['software']['source'];
        return response()->json(['status' => 0, 'message' => '获取成功', 'data' => $forumdata])->setCallback($request->input('callback'));
                // return response()->json(['status' => 0, 'message' => '获取成功', 'data' => $forumdata]);

    }
}
