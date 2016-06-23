<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Project\Comment as CommentModel;

class CommentController extends Controller
{
    public function save(Request $request)
    {
        //
        $input = $request->only(['project_id', 'user_id', 'content']);
        $comment_id = $request->input('comment_id');

        //被回复的评论
        $reply_comment =  CommentModel::find($comment_id,['id as reply_comment','project_id', 'user_id as reply_user']);
        if ($reply_comment !== null) {
            $input = array_merge($input,$reply_comment->toArray());
        }
        if (empty($input['project_id'])) {
            return ['status' => -1, 'message' => '项目ID不能为空'];
        }

        $comment = CommentModel::create($input);
        return ['status' => 0, 'message' => '保存成功', 'data' => $comment];
    }

    public function get(Request $request)
    {
        $project_id = $request->input('project_id');
        //
        // $commentList =  CommentModel::where('project_id', $project_id)
        //         ->orderby('reply_comment')
        //         ->orderby('created_at')->get();

        //嵌套评论
        // $commentNest = [];
        // foreach ($commentList->toArray() as $comment) {
        //     if ($comment['reply_comment'] == 0) {
        //         $comment['sub_comments'] = array();
        //         $commentNest[$comment['id']] = $comment;
        //     } else {
        //         $commentNest[$comment['reply_comment']]['sub_comments'][$comment['id']] = $comment;
        //     }
        // }
        // return $commentNest;

        return CommentModel::where('project_id', $project_id)
                ->orderby('created_at')->get();
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function remove($id)
    {
        //
    }
}
