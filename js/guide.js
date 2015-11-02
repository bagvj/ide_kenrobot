define(['eventcenter', 'jquery', 'hardware', 'kenrobotJsPlumb', 'defaultJs'], function(eventcenter, $, hardware, kenrobotJsPlumb, defaultJs) {

	var cover = null;

	function setCookie(c_name, value, expiredays) {
		var exdate = new Date()
		exdate.setDate(exdate.getDate() + expiredays)
		document.cookie = c_name + "=" + escape(value) +
			((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
	}

	function getCookie(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1) c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
	}

	function step1() {
		$(".nav-second .scmk .triangle").click();
		$(".nav-second .scmk .content-container li:first-child").css({
			"z-index": 1000,
			"background-color": "white"
		});
		$(".hardware-board-item").css("z-index", 1000);
		$(".ui-droppable").css("z-index", 1000);

		var top = $(".nav-second .scmk .content-container li:first-child").offset().top;
		var left = $(".nav-second .scmk .content-container li:first-child").offset().left + 100;
		showToolTip("", "url(img/guide/led.png)", top, left, 200, 100);

		top = $(".hardware-board-item").offset().top - 100;
		left = $(".hardware-board-item").offset().left + 100;
		showToolTip("", "url(img/guide/arrow1.png)", top, left, 200, 100);
	}

	function step1Close() {
		$(".nav-second .scmk .content-container li:first-child").css({
			"z-index": "998",
			"background-color": "none"
		});
		$(".hardware-board-item").css("z-index", "998");
		$(".ui-droppable").css("z-index", "998");

		$(".guide-tooltip").remove();
	}

	function step2() {
		$(".nav-first li.rjbc").css("z-index", 1000);
		var top = $(".nav-first li.rjbc").offset().top + 20;
		showToolTip("", "url(img/guide/rjbc.png)", top, 90, 200, 100);
	}

	function step2Close() {
		$(".nav-first li.rjbc").css("z-index", 998);

		$(".guide-tooltip").remove();
	}

	function step3() {
		$(".nav-second .ypzmk .content-container li:nth-child(2)").css({
			"z-index": 1000,
			"background-color": "white"
		});
		$(".flowchart-oval-item:first-child").css("z-index", 1000);

		var top = $(".nav-second .ypzmk .content-container li:nth-child(2)").offset().top;
		var left = $(".nav-second .ypzmk .content-container li:nth-child(2)").offset().left + 100;
		showToolTip("", "url(img/guide/led.png)", top, left, 200, 100);

		top = $(".flowchart-oval-item:first-child").offset().top;
		left = $(".flowchart-oval-item:first-child").offset().left + 100;
		showToolTip("", "url(img/guide/arrow3.png)", top, left, 100, 100);
	}

	function step3Close() {
		$(".nav-second .ypzmk .content-container li:nth-child(2)").css({
			"z-index": 998,
			"background-color": "white"
		});
		$(".flowchart-oval-item:first-child").css("z-index", 998);

		$(".guide-tooltip").remove();
	}

	function step4() {
		$(".flowchart-light-item").css("z-index", 1000);

		var top = $(".flowchart-light-item").offset().top + 10;
		var left = $(".flowchart-light-item").offset().left + 80;
		showToolTip("", "url(img/guide/edit.png)", top, left, 200, 100);
	}

	function step4Close() {
		$(".flowchart-light-item").css("z-index", 998);
		$(".guide-tooltip").remove();
	}

	function step5() {
		var top = $(".flowchart-light-item").offset().top + 40;
		var left = $(".flowchart-light-item").offset().left + 400;
		showToolTip("", "url(img/guide/property.png)", top, left, 200, 100);
	}

	function step5Close() {
		$(".guide-tooltip").remove();
	}

	function step6() {
		$(".nav-first li.fzyz").css("z-index", 1000);

		var top = $(".nav-first li.fzyz").offset().top + 20;

		showToolTip("", "url(img/guide/fzyz.png)", top, 90, 200, 100);
	}

	function step6Close() {
		$(".nav-first li.fzyz").css("z-index", 998);
		$(".guide-tooltip").remove();
	}

	function show(step) {
		var guideValue = getCookie('guide');
		if (guideValue == 1) {
			return;
		}
		switch (step) {
			case 1:
				step1();
				showCover();
				break;
			case 2:
				step1Close();
				step2();
				break;
			case 3:
				step2Close();
				step3();
				break;
			case 4:
				step3Close();
				step4();
				break;
			case 5:
				step4Close();
				step5();
				break;
			case 6:
				step5Close();
				hide();
				setCookie('guide', 1);
				// step6();
				break;
			case 7:
				step6Close();
				hide();
				setCookie('guide', 1);
			default:
				break;
		}
	}

	function showToolTip(content, url, top, left, width, height) {
		var toolTip = $("<div class='guide-tooltip'></div>").css({
			"background": url + " no-repeat",
			"z-index": "1000",
			"position": "absolute",
			"color": "white",
			"top": top,
			"left": left,
			"width": width,
			"height": height,
			"background-size": "contain"
		});
		$("body").append(toolTip);
		toolTip.html(content);
	}

	/**
	 * @desc modal dialog展示时候的遮罩
	 */
	function showCover() {
		cover = $("<div></div>").css({
			"filter": "alpha(opacity:50)",
			"-moz-opacity": 0.5,
			"opacity": 0.5,
			"background-color": "#000",
			"z-index": "999",
			"position": "absolute",
			"top": "0px",
			"left": "0px"
		});
		$("body").append(cover);
		cover.width($(window).width()).height($(window).height());
	}

	/**
	 * @desc 隐藏并毁灭窗口
	 */
	function hide() {
		if (cover != null) cover.remove();
	}

	hardware.setShowGuid(show);

	kenrobotJsPlumb.setShowGuid(show);

	defaultJs.setShowGuid(show);

	return {
		"show": show,
		"hide": hide
	};
});