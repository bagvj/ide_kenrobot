<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Project\Comment as CommentModel;
use Auth;


class CommentController extends Controller
{
    public function save(Request $request)
    {
        //
        $input = $request->only(['project_id', 'user_id', 'content']);
        $comment_id = $request->input('comment_id');

        if (!Auth::check()) {
            return collect( ['status' => -1, 'message' => '请您登录后进行操作'])->toJson(JSON_UNESCAPED_UNICODE); 
        }

        $strlen = strlen($input['content']);
        if ($strlen < 10 || 1000 < $strlen) {
          return collect( ['status' => -3, 'message' => '评论内容限定到10-1000字'])->toJson(JSON_UNESCAPED_UNICODE);
        }

        //敏感词
        $uglyWords = $this->uglywordfitler($input['content']);
        if (!empty($uglyWords)) {
            return collect(['status' => -4, 'message' => $uglyWords])->toJson(JSON_UNESCAPED_UNICODE);
        }


        //被回复的评论
        $reply_comment =  CommentModel::find($comment_id,['id as reply_comment','project_id', 'user_id as reply_user']);
        if ($reply_comment !== null) {
            $input = array_merge($input,$reply_comment->toArray());
        }
        if (empty($input['project_id'])) {
            return collect(['status' => -2, 'message' => '项目ID不能为空'])->toJson(JSON_UNESCAPED_UNICODE);
        }

        $comment = CommentModel::create($input);
        if ($comment) {
            $comment['name'] = $comment->user->name;
            $comment['avatar_url'] = $comment->user->avatar_url;
            $comment['floor'] = CommentModel::where('project_id', $input['project_id'])->count();
            unset($comment['user']);
            return collect(['status' => 0, 'message' => '评论成功','data' => $comment->toArray()])->toJson(JSON_UNESCAPED_UNICODE);
        }else {
            return collect(['status' => -5, 'message' => '评论失败'])->toJson(JSON_UNESCAPED_UNICODE);
        }
        return ;
    }

    private function uglywordfitler($content)
    {
        $words = ['李志华','二货','傻逼','孙子'];
        foreach ($words as $val) {
            if (strpos($content, $val) !== false) {
                return "[$val]不符合相关法律规定，请选用其他词汇";
            }
        }
        return '';
    }

    public function get(Request $request)
    {
        $project_id = $request->input('project_id');
        $page = $request->input('page');
        $pagesize =$request->input('pagesize');
        $page = intval($page);
        $page = $page > 0 ? $page : 0;
        $pagesize = intval($pagesize);
        $pagesize = $pagesize > 0 ? $pagesize : 0;
        if ($pagesize > 0) {
            $result = CommentModel::where('project_id', $project_id)
                ->orderby('created_at')
                ->skip($page * $pagesize)
                ->take($pagesize)
                ->get();
        }else{
             $result = CommentModel::where('project_id', $project_id)
                ->orderby('created_at')->get();
        }

       

        if ($result->count() <= 0) {
           return collect(['status' => -1, 'message' => '该项目无评论数据！'])->toJson(JSON_UNESCAPED_UNICODE);
        }

        foreach ($result as $k => $val) {
            $result[$k]['name'] = $val->user->name;
            $result[$k]['avatar_url'] = $val->user->avatar_url;
            $result[$k]['floor'] = $k + 1;
            unset($result[$k]['user']);
        }
        return collect(['status' => 0, 'message' => '获取成功', 'data' =>$result->toArray()])->toJson(JSON_UNESCAPED_UNICODE);

    }

    public function update(Request $request, $id)
    {
        //
    }

    public function remove(Request $request)
    {
        // 
        $id = $request->input('id');
        $id = intval($id);

        if ( ! Auth::check()) {
        return collect(['status' => -1, 'message' => '没有操作该数据的权限'])->toJson(JSON_UNESCAPED_UNICODE);

        }

        $comment = CommentModel::find($id);
        if ($comment == null) {
            return collect( ['status' => -2, 'message' => '评论数据不存在'])->toJson(JSON_UNESCAPED_UNICODE);
        }
        $user = Auth::user();
        if ($user->id != $comment->user_id) {
            return collect(['status' => -3, 'message' => '没有操作该数据的权限'])->toJson(JSON_UNESCAPED_UNICODE);
        }

        $comment->delete();
        return collect(['status' => 0, 'message' => '删除成功'])->toJson(JSON_UNESCAPED_UNICODE);

    }


}
