define(['vendor/jquery', 'vendor/mousetrap', './EventManager', './config', './util', './hardware', './user', './project', './software', './sidebar', './topMenu', './logcat', './board', './component', './library', './ext/agent', './guide'], function(_, Mousetrap, EventManager, config, util, hardware, user, project, software, sidebar, topMenu, logcat, board, component, library, extAgent, guide) {
	function init() {
		initPV();
		initAjax();
		initKeys();
		initEscape();

		user.init();
		sidebar.init();
		topMenu.init();
		logcat.init();
		board.init();
		component.init();
		library.init();
		hardware.init();
		software.init({
			getNodes: hardware.getNodes,
			getFileName: project.getProjectName,
			getAuthor: user.getUserName,
		});
		extAgent.init(config.extension);

		guide.init();

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
		if(config.needPV) {
			var hm = document.createElement("script");
			hm.src = "//hm.baidu.com/hm.js?6518098de0bee39bef219952dbbae669";
			var s = document.getElementsByTagName("script")[0]; 
			s.parentNode.insertBefore(hm, s);
		}
	}

	function initKeys() {
		//保存
		Mousetrap.bind(['ctrl+s', 'command+s'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('global', 'project.save');
		});

		//编译
		Mousetrap.bind(['ctrl+b', 'command+b'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('global', 'project.build');
		});

		//格式化
		Mousetrap.bind(['ctrl+u', 'command+u'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('global', 'software.format');
		});
	}

	function initEscape() {
		$(window).on('keydown', function(e) {
			if(e.keyCode != 27) {
				return;
			}

			if(util.isInDialog()) {
				return;
			}

			if(logcat.isShow()) {
				logcat.hide();
				return;
			}

			if(sidebar.isShow()) {
				sidebar.hide();
				return;
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