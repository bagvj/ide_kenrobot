<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class IdeTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //主板
        Schema::create('boards', function (Blueprint $table) {
            $table->increments('id')->comment("主板id");
            $table->string('name')->comment("主板名字");
            $table->string('label')->comment("主板名字(用于显示)");
            $table->string('board_type')->comment("主板类型");
            $table->boolean('in_use')->comment("是否正在使用");
            $table->integer('width')->comment('宽度');
            $table->integer('height')->comment('高度');
            $table->string('category')->comment("类别");
            $table->boolean('is_forward')->comment('敬请期待')->default(true);
            $table->boolean('is_hot')->comment('热门')->default(false);
        });

        //器件
        Schema::create('components', function (Blueprint $table) {
            $table->increments('id')->comment("器件id");
            $table->string('name')->comment("器件名字");
            $table->string('label')->comment("器件名字(用于显示)");
            $table->boolean('in_use')->comment("是否正在使用");
            $table->boolean('auto_connect')->comment('是否自动连接');
            $table->integer('width')->comment('宽度');
            $table->integer('height')->comment('高度');
            $table->string('varName')->comment('默认变量名');
            $table->string('varCode')->comment('变量声明代码');
            $table->string('headCode')->comment('引用头文件代码');
            $table->string('setupCode')->comment('初始化代码');
            $table->string('category')->comment("类别");
            $table->string('extra', 1000)->comment('额外数据')->default('');
        });

        //端口
        Schema::create('ports', function (Blueprint $table) {
            $table->increments('id')->comment("端口id");
            $table->string('name')->comment("端口名字");
            $table->string('label')->comment("端口标签");
            $table->integer('type')->comment('端口类型，0=>digital、1=>data、2=>digital/data、3=>serialPort');
            $table->string('special')->comment('特殊端口');
            $table->integer('owner_id')->comment('拥有者id');
            $table->integer('owner_type')->comment('拥有者类型，0=>component、1=>board');
        });

        Schema::create('libraries', function (Blueprint $table) {
            $table->increments('id')->comment("library id");
            $table->string('name')->comment("library名字");
            $table->binary('code')->comment("引用代码");
            $table->boolean('in_use')->comment('正在使用')->default(true);
        });

        Schema::create('examples', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->comment('名字');
            $table->string('category')->comment('目录');
            $table->integer('order')->comment('顺序');
            $table->string('uuid')->comment('唯一id')->default("");
            $table->softDeletes();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->increments('id');
            $table->string('project_name', 200)->comment('项目名称');
            $table->integer('user_id')->comment('用户id');
            $table->integer('uid')->comment('主账号系统用户uid');
            $table->string('project_intro', 2000)->comment('项目介绍');
            $table->string('author', 200)->comment("作者");

            //执行好要改为varbinay
            $table->string('project_data',8000)->comment('项目数据');
            $table->integer('public_type')->comment('公开类型 0:私有 1:好友可见 2:完全公开');
            $table->string('hash', 20)->unique('hash')->comment('项目HASH');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('project_id')->comment('项目ID');
            $table->integer('user_id')->comment('用户user_id');
            $table->string('content', 3000)->comment('评论内容');
            $table->integer('reply_comment')->default(0)->comment('回复评论ID');
            $table->integer('reply_user')->default(0)->comment('回复用户user_id');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement("ALTER TABLE projects MODIFY COLUMN project_data mediumblob");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("boards");
        Schema::drop("components");
        Schema::drop("ports");
        Schema::drop("libraries");
        Schema::drop("examples");
        Schema::drop("projects");
        Schema::drop("comments");
    }
}
