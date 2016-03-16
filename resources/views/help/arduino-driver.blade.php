<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>啃萝卜智能硬件平台</title>
		<meta name="description" content="啃萝卜智能硬件平台" />
		<meta name="keywords" content="啃萝卜智能硬件平台" />
		<meta name="csrf-token" content="{{csrf_token()}}" />

		<link href="/assets/images/favicon.ico" type="image/x-icon" rel="shortcut icon" />
		<script src="/assets/js/lib/jquery.min.js"></script>
		<script type="text/javascript">
			$(function() {
				var bit;
				if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
					bit = 64;
				} else {
					bit = 32;
				}

				var a = $('.arduinoDriverUrl');
				var href = a.attr('href');
				a.attr('href', href + "-x" + bit + ".zip");
			});
		</script>
	</head>
	<body>
		<div>
			如果你遇到了Arduino驱动问题，请按以下步骤操作：<br />
			Step1: 点击<a class="arduinoDriverUrl" href="http://platform.kenrobot.com/download/arduino-driver">驱动下载</a>并解压<br />
			Step2: 运行arduino驱动安装.exe<br />
			Step3: 完成安装，<a href="http://platform.kenrobot.com/">返回主页</a>
		</div>
	</body>
</html>