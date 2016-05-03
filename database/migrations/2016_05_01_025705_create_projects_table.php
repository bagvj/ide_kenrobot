<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->increments('id');
            $table->string('project_name', 200)->comment('项目名称');
            $table->integer('user_id')->comment('用户ID');
            $table->integer('uid')->comment('主账号系统用户uid');
            $table->string('project_intro', 2000)->comment('项目介绍');

            //执行好要改为varbinay
            $table->string('project_data',8000)->comment('项目数据');
            $table->integer('public_type')->comment('公开类型 0:私有 1:好友可见 2:完全公开');
            $table->string('hash', 200)->comment('项目HASH');
            $table->string('project_type', 200)->comment('项目类别:scratch or dev');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('projects');
    }
}
