define(["jquery", "kenrobotDialog", "eventcenter"], function($, kenrobotDialog, eventcenter) {

	var var_list = [];
	var varContainerId;
	var container;
	var sel_item;

	function getFormatTR(data) {
		return "<tr class='tr'><td>" + data.name + "</td><td>" + data.type + "</td><td>" + data.kind + "</td><td>" + data.initial + "</td><td></td>tr>"
	}

	$(".var-side .btn.add").click(function() {
		kenrobotDialog.show(0, {
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
			}]
		}, saveVarList);
	});

	$(".var-side .btn.modify").click(function() {
		if(!sel_item){
			return;
		}
		container = $("#" + varContainerId);
		var items = container.find(".tr");
		var index;
		for(var i = 0; i < items.length; i++) {
			if($(items[i]).html() == sel_item.html()){
				index = i;
				break;
			}
		}
		var varInfo = var_list[index];

		kenrobotDialog.show(0, {
			"title": "添加/更改变量",
			"isSplit": 0,
			"contents": [{
				"title": "变量名称",
				"inputType": "text",
				"inputHolder": "",
				"inputInitValue": varInfo.name,
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
				"inputInitValue": varInfo.type,
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
				"inputInitValue": varInfo.kind,
				"inputKey": "kind"
			}, {
				"title": "变量初值",
				"inputType": "text",
				"inputHolder": "",
				"inputInitValue": varInfo.initial,
				"inputKey": "initial"
			}]
		}, saveVarList);
	});

	function saveVarList(data) {
		data.initial = data.initial == "" ? (data.type == "bool" ? "false" : (data.type == "unsigned char" ? "''" : "0")) : data.initial;
		var index = -1;
		for(var i = 0; i < var_list.length; i++){
			if(var_list[i].name == data.name){
				index = i;
				break;
			}
		}
		container = $('#' + varContainerId);
		if(index >= 0){
			var varInfo = var_list[index];
			varInfo.name = data.name;
			varInfo.type = data.type;
			varInfo.kind = data.kind;
			varInfo.initial = data.initial;
			var tr = $(container.find(".tr")[index]);
			$(getFormatTR(data)).insertAfter(tr);
			tr.remove();
			sel_item = null;
		} else {
			container.append(getFormatTR(data));
			var_list.push({
				"name": data.name,
				"type": data.type,
				"kind": data.kind,
				"initial": data.initial
			});
		}
		bindItemEvent();
		eventcenter.trigger('genC', 'refresh');
	}

	$(".var-side .btn.del").click(function() {
		if (sel_item) {
			var index = sel_item.index() - 1;
			sel_item.remove();
			sel_item = null;
			var_list.splice(index, 1);

			eventcenter.trigger('genC', 'refresh');
		}
	})

	function bindItemEvent() {
		container = $('#' + varContainerId);
		container.html(container.html());
		container.find(".tr").mousemove(function(e) {
			$(this).attr("class", "tr special");
		});
		container.find(".tr").mouseout(function(e) {
			if (sel_item && sel_item.html() == $(this).html()) {
				return;
			}
			$(this).attr("class", "tr normal");
		});
		container.find(".tr").click(function() {
			if (sel_item && sel_item.html() == $(this).html()) {
				$(this).attr("class", "tr normal");
				sel_item = null;
			} else {
				$(this).attr("class", "tr special");
				sel_item = $(this);
			}
		});
	}

	function initVarTable(containerId) {
		varContainerId = containerId;
		container = $('#' + varContainerId);
		if(!container){
			alert("缺少初始化变量的位置");
			return false;
		}

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