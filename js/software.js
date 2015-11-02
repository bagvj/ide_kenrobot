define(["jquery", "kenrobotDialog", "eventcenter"], function($, kenrobotDialog, eventcenter) {

	var var_list = [{
		"name": "result",
		"type": "long",
		"kind": "auto",
		"initial": 0,
		"scope": "global"
	}];
	var varTable_container = 'var-table';
	var container = $('#' + varTable_container);
	var sel_item;

	function getFormatTR(data) {
		return "<tr class='tr'><td>" + data.name + "</td><td>" + data.type + "</td><td>" + data.kind + "</td><td>" + data.initial + "</td><td>" + data.scope + "</td><td></td>tr>"
	}

	$(".var-side .btn.add").click(function() {
		var fc_top = $("#flowchart-container").offset().top + 100;
		var fc_left = $("#flowchart-container").offset().left + $("#flowchart-container").width() / 2 - 125;
		kenrobotDialog.show(0, {
			"top": fc_top,
			"left": fc_left,
			"title": "添加/更改变量",
			"isSplit": 0,
			"contents": [{
				"title": "变量名称",
				"inputType": "text",
				"inputHolder": "",
				"inputInitValue": "",
				"inputKey": "name"
			}, {
				"title": "变量类型",
				"inputType": "select",
				"inputHolder": [{
					"value": "bool",
					"text": "bool"
				}, {
					"value": "unsigned char",
					"text": "unsigned char"
				}, {
					"value": "int",
					"text": "int"
				}, {
					"value": "long",
					"text": "long"
				}, {
					"value": "float",
					"text": "float"
				}],
				"inputInitValue": "int",
				"inputKey": "type"
			}, {
				"title": "变量种类",
				"inputType": "select",
				"inputHolder": [{
					"value": "auto",
					"text": "auto"
				}, {
					"value": "register",
					"text": "register"
				}, {
					"value": "static",
					"text": "static"
				}, {
					"value": "volatile",
					"text": "volatile"
				}],
				"inputInitValue": "auto",
				"inputKey": "kind"
			}, {
				"title": "变量初值",
				"inputType": "text",
				"inputHolder": "",
				"inputInitValue": "",
				"inputKey": "initial"
			}, {
				"title": "变量作用域",
				"inputType": "select",
				"inputHolder": [{
					"value": "local",
					"text": "局部变量"
				}, {
					"value": "global",
					"text": "全局变量"
				}],
				"inputInitValue": "local",
				"inputKey": "scope"
			}, ]
		}, saveFlowchartProperty);
	});

	function saveFlowchartProperty(data) {
		var_list.push({
			"name": data.name,
			"type": data.type,
			"kind": data.kind,
			"initial": data.initial,
			"scope": data.scope
		});
		container = $('#' + varTable_container);
		container.append(getFormatTR(data));
		bindItemEvent();
		eventcenter.trigger('generateC', 'refresh');
	}

	$(".var-side .btn.del").click(function() {
		if (sel_item) {
			sel_item.remove();
			eventcenter.trigger('generateC', 'refresh');
		}
	})

	function bindItemEvent() {
		container = $('#' + varTable_container);
		container.html(container.html())
		container.find(".tr").mousemove(function(e) {
			$(this).attr("class", "tr special")
		});
		container.find(".tr").mouseout(function(e) {
			if (sel_item && sel_item.html() == $(this).html()) {
				return
			}
			$(this).attr("class", "tr normal")
		});
		container.find(".tr").click(function() {
			if (sel_item) {
				sel_item.attr("class", "tr normal")
			}
			if (sel_item && sel_item.html() == $(this).html()) {
				$(this).attr("class", "tr normal")
				sel_item = ""
			} else {
				$(this).attr("class", "tr special")
				sel_item = $(this)
			}
		});
	}

	function initVarTable(strContainer) {
		varTable_container = strContainer;
		if (varTable_container.length == 0) {
			alert("缺少初始化变量的位置");
			return false;
		}

		container = $('#' + varTable_container);
		for (var i = 0; i < var_list.length; i++) {
			container.append(getFormatTR(var_list[i]));
		};
		bindItemEvent();
	}

	function getVarList() {
		return var_list;
	}

	return {
		initVarTable: initVarTable,
		getVarList: getVarList
	}
});