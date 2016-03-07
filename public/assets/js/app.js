define(['jquery', 'config', 'hardware', 'user', 'project', 'software', 'sidebar', 'board', 'component', 'library'], function($, config, hardware, user, project, software, sidebar, board, component, library) {
	function init() {
		initAjax();

		user.init();
		sidebar.init();
		board.init();
		component.init();
		library.init();
		hardware.init();
		software.init(hardware.getNodes);

		if(config.showUnloadDialog) {
			$(window).bind('beforeunload', function(){
				return '您的项目尚未保存，确定离开此页面吗？';
			});
		}
		
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