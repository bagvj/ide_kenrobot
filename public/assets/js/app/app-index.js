define(['jquery', './config', './hardware', './user', './project', './software', './sidebar', './board', './component', './library'], function($, config, hardware, user, project, software, sidebar, board, component, library) {
	function init() {
		initPV();
		initAjax();

		user.init();
		sidebar.init();
		board.init();
		component.init();
		library.init();
		hardware.init();
		software.init(hardware.getNodes);
		
		if(config.showFirstVisitHint) {
			$('.login-hint-layer').on('click', function(){
				$(this).remove();
			}).show().delay(3000).queue(function() {
				$(this).remove();
			});
		} else {
			$('.login-hint-layer').remove();
		}

		$.ajax({
			url: '/config',
			dataType: 'json',
		}).done(onLoadSuccess);
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	//pv统计
	function initPV() {
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?6518098de0bee39bef219952dbbae669";
		var s = document.getElementsByTagName("script")[0]; 
		s.parentNode.insertBefore(hm, s);
	}

	function onLoadSuccess(result) {
		board.load(result.boards);
		component.load(result.components);
		library.load(result.libraries);

		hardware.load(result);

		project.init();
	}

	return {
		init: init,
	}
});