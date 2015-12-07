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
		Schema::create('ken_feedback', function (Blueprint $table) {
			$table->increments('id');

			$table->string('nickname');
			$table->string('contact');
			$table->string('content');
			$table->integer('create_time');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
		Schema::drop('ken_feedback');
	}
}
