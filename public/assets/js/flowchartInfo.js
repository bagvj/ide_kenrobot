define(["jquery"], function($) {

	function getFlowchart(data, call) {
		$.ajax({
			type: "POST",
			url: "./GetFlowchartInfo.php",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				call(result);
			}
		});
	}

	function addFlowchart(data) {
		$.ajax({
			type: "POST",
			url: "./AddFlowchartInfo.php",
			data: data,
			dataType: "json",
			async: true, //需同步处理完成后才能进行下一步，故此处用async
			success: function(result) {
				console.log(result);
				alert("保存成功！");
			}
		});
	}

	return {
		getFlowchart: getFlowchart,
		addFlowchart: addFlowchart
	}

});