define(function($, IO, Menu, util) {
	var editor;

	function init() {
		initSoftwareMenu();
		initEditor();

		var headerTabItems = $('.header .tab li').on('click', onHeaderTabClick);

		var hardwareTabItems = $('.hardware .tab li').on('click', onHardwareTabClick);
		var softwareTabItems = $('.software .tab li').on('click', onSoftwareTabClick);

		var sortwareSubTabItems = $('.software .sub-tab li').on('click', onSoftwareSubTabClick);

		headerTabItems.item(0).fire("click");
		hardwareTabItems.item(0).fire("click");
		softwareTabItems.item(0).fire("click");
		sortwareSubTabItems.item(1).fire("click");
	}

	function initSoftwareMenu() {
		var filePopMenu = new Menu.PopupMenu({
			xclass: 'popupmenu',
			prefixCls: 'software-',
			align: {
				points: ['bl', 'tl']
			},
			autoHideOnMouseLeave: true,
			children: [{
				xclass: 'menuitem',
				prefixCls: 'software-',
				content: '保存',
				ATTRS: {
					action: 'save',
				},
			}, {
				xclass: 'menuitem',
				prefixCls: 'software-',
				content: '下载',
				ATTRS: {
					action: 'download',
				},
			}, {
				xclass: 'menuitem',
				prefixCls: 'software-',
				content: '分享',
				ATTRS: {
					action: 'share',
				},
			}, ],
			listeners: {
				'click': onSoftwareMenuClick,
			},
		});

		var menu = new Menu({
			render: '.software .menu',
			prefixCls: 'software-',
			children: [{
				xclass: 'submenu',
				prefixCls: 'software-',
				content: '文件',
				menu: filePopMenu,
			}, ],
		});
		menu.render();
	}

	function initEditor() {
		editor = ace.edit($(".software .editor")[0]);
		editor.setTheme("ace/theme/monokai");
		editor.session.setMode("ace/mode/c_cpp");
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
	}

	function onSoftwareMenuClick(e) {
		var menuItem = e.target;
		var action = menuItem.getAttrVals().ATTRS.action;
		switch (action) {
			case 'save':
				onSaveClick();
				break;
			case 'download':
				onDownloadClick();
				break;
			case 'share':
				onShareClick();
				break;
		}
	}

	function onSaveClick() {

	}

	function onDownloadClick() {
		var source = editor.getValue();
		var bytes = [];
		for (var i = 0; i < source.length; ++i) {
			bytes.push(source.charCodeAt(i));
		}

		var projectName = "Arduino";
		var buildType = "Arduino";

		new IO({
			type: "POST",
			url: "./build",
			data: {
				source: bytes,
				projectName: projectName,
				buildType: buildType
			},
			dataType: "json",
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			success: function(result) {
				if (result.code == 0 && result.url) {
					window.open(result.url);
				} else {
					util.message(result.msg);
				}
			},
			error: function(result) {
				console.log(result);
			}
		});
	}

	function onShareClick() {

	}

	function onHeaderTabClick(e) {
		var li = $(this);
		if (li.index() == 2) {
			return;
		}
		if (toggleActive(li)) {
			$('.content .mod').removeClass("active").item(li.index()).addClass("active");
		}
	}

	function onHardwareTabClick(e) {
		var li = $(this);
		if (toggleActive(li)) {

		}
	}

	function onSoftwareTabClick(e) {
		var li = $(this);
		if (toggleActive(li)) {

		}
	}

	function onSoftwareSubTabClick(e) {
		var li = $(this);
		if (toggleActive(li)) {
			$('.software .sub-mod').removeClass("active").item(li.index()).addClass("active");
		}
	}

	function toggleActive(li) {
		if (li.hasClass("active")) {
			return false;
		}

		li.parent().all("li.active").removeClass("active");
		li.addClass("active");

		return true;
	}

	return {
		init: init,
	}
}, {
	requires: ['node', 'io', 'menu', 'platform/util']
});