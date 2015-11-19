define(["jquery", "kenrobotDialog", "eventcenter"], function($, kenrobotDialog, eventcenter) {

	var varList = [];
	var varContainerId;
	var container;
	var curRow;

	function getFormatTR(data) {
		return "<td>" + data.name + "</td><td>" + data.type + "</td><td>" + data.kind + "</td><td>" + data.initial + "</td><td></td>"
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
		if(!curRow) {
			return;
		}
		
		var index = curRow.index();
		var varInfo = varList[index];

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
		if(data.name == "") {
			// alert();
			return;
		}

		data.initial = data.initial == "" ? (data.type == "bool" ? "false" : (data.type == "unsigned char" ? "''" : "0")) : data.initial;
		container = $('#' + varContainerId);
		var index = -1;
		for(var i = 0; i < varList.length; i++) {
			var varInfo = varList[i];
			if(varInfo.name == data.name) {
				index = i;
				break;
			}
		}

		$("tbody tr.active", container).removeClass("active");
		if(index >= 0){
			var varInfo = varList[index];
			varInfo.name = data.name;
			varInfo.type = data.type;
			varInfo.kind = data.kind;
			varInfo.initial = data.initial;
			curRow = $('tr:eq(' + (index + 1) + ')', container).addClass("active");
			curRow.html(getFormatTR(data));
		} else {
			varList.push({
				name: data.name,
				type: data.type,
				kind: data.kind,
				initial: data.initial
			});

			curRow = $('<tr></tr>').addClass("active").html(getFormatTR(data)).appendTo($("tbody", container)).click(function() {
				$("tbody tr.active", container).removeClass("active");
				curRow = $(this).addClass("active");
			});
		}
		eventcenter.trigger('genC', 'refresh');
	}

	$(".var-side .btn.del").click(function() {
		if (curRow) {
			var index = curRow.index();
			varList.splice(index, 1);
			curRow.remove();
			curRow = null;
			eventcenter.trigger('genC', 'refresh');
		}
	})

	function initVarTable(containerId) {
		varContainerId = containerId;
		container = $('#' + varContainerId);
		for (var i = 0; i < varList.length; i++) {
			container.append(getFormatTR(varList[i]));
		};
	}

	function getVarList() {
		return varList;
	}

	return {
		initVarTable: initVarTable,
		getVarList: getVarList
	}
});