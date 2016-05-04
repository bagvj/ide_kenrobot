<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
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
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('comments');
    }
}
