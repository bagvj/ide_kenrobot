<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Robot\Project;
use App\Robot\FlowChart;

class ProjectController extends Controller
{

    /**
     * Get
     */
    public function index(Request $request)
    {
        $user_id = $request->input('user_id');
        $projectList = Project::where('user_id', $user_id)
                        ->orderBy('create_time')
                        ->orderBy('update_time','desc')
                        ->get(['id','name','scope','info']);

        return collect([ 'list' => $projectList->toArray()]);
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
        $newProject = $request->only('name','scope','user_id','user_name','status','info');
        $now = time();
        $newProject['create_time'] = $now;
        $newProject['update_time'] = $now;
        $project = Project::create($newProject);
        return $project;

    }

    /**
     * 编辑project信息
     */
    public function edit(Request $request)
    {
        $id = $request->input('id');

        $project = Project::find($id);

        if ($project === null) {
            return 'empty project';
        }

        $projectData  = $request->only('name','scope','user_id','user_name','status','info');

        $project->name = $projectData['name'];
        $project->scope = $projectData['scope'];
        $project->user_id = $projectData['user_id'];
        $project->user_name = $projectData['user_name'];
        $project->status = $projectData['status'];
        $project->info = $projectData['info'];

        $project->save();



        return $project->id;


    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        Project::destroy($id);
        $affectRows = FlowChart::where('pid',$id)->delete();


    }

}
