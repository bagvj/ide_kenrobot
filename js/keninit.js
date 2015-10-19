define(['jquery','kenrobotDialog','eventcenter'],function($,kenrobotDialog,eventcenter){
	function init(){
		// 关闭默认右键菜单
		$("body").bind("contextmenu",function(e){
			var obj=$(e.target);
			if(!obj.hasClass("hardware-container-item") && !obj.hasClass("flowchart-container-item")){
				return false;
			}
			kenrobotDialog.hide();
		});
		$("body").bind("selectstart",function(){return false;});
		$("#hardware-container").mousewheel(function(event, deltaj, deltax, deltay){
			eventcenter.trigger('hardware','mousewheel',{e:event,j:deltaj,x:deltax,y:deltay});
		}).mousedown(function(e){
			eventcenter.trigger('hardware','mousedown',e)
		});

		initIndexInfo();
	}

	function initIndexInfo(){
		$.ajax({
			type: "GET",
			url: "./GetInitInfo.php",
			data: "",
			dataType:"json",
			success: function(result){
				// console.log(result);
				$('#platform_name').html("欢迎你，" + result.uname);
			}
		});
	}

	return {
		init:init
	}
});
