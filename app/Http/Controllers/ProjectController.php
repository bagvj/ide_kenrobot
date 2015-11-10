<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Robot\Project;

class ProjectController extends Controller
{

    /**
     * Get
     */
    public function index(Request $request)
    {
        $user_id = $request->input('user_id');
        $data = Project::where('user_id', $user_id)
                        ->orderBy('create_time')
                        ->orderBy('update_time','desc')
                        ->get(['id','name','scope','info']);

        return collect([ 'list' => $data->toArray()]);
    }

    public function info(Request $request)
    {
        $id = $request->input('id');
        if (!empty($id)) {
            $projectinfo = Project::find($id);
            return collect(['info' => $projectinfo->toArray()])->toJson();
        }

        return collect([])->toJson();

    }

    //addProject
    public function create(Request $request)
    {
        $data = $request->only('name','scope','user_id','user_name','status','info');
        $now = time();
        $data['create_time'] = $now;
        $data['update_time'] = $now;
        $project = Project::create($data);
        return $project;

    }

    public function destroy()
    {
        return __METHOD__;
    }

}
