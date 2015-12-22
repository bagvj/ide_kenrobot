<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateFeedbackTable extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
		Schema::create('feedbacks', function (Blueprint $table) {
			$table->increments('id')->comment("ID");

			$table->string('nickname')->comment("昵称");
			$table->string('contact')->comment("联系方式");
			$table->string('content')->comment("意见建议");
			$table->integer('create_time')->comment("创建时间");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::drop('feedbacks');
	}
}
