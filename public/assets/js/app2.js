define(['jquery', 'bootstrap', 'ace', 'util'], function($, _, _, util){
	//默认代码
	var defaultCode = "void setup() {\n  // put your setup code here, to run once:\n\n}\n\nvoid loop() {\n  // put your main code here, to run repeatedly:\n\n}";

	//加载库配置
	var includeConfigs = [{
		name: 'Bridge',
		code: '#include <Bridge.h>\n#include <Console.h>\n#include <FileIO.h>\n#include <HttpClient.h>\n#include <Mailbox.h>\n#include <Process.h>\n#include <YunClient.h>\n#include <YunServer.h>\n\n',
	}, {
		name: 'EEPROM',
		code: '#include <EEPROM.h>\n\n',
	}, {
		name: 'Esplora',
		code: '#include <Esplora.h>\n\n',
	}, {
		name: 'Ethernet',
		code: '#include <Dhcp.h>\n#include <Dns.h>\n#include <Ethernet.h>\n#include <EthernetClient.h>\n#include <EthernetServer.h>\n#include <EthernetUdp.h>\n\n'
	}, {
		name: 'Firmata',
		code: '#include <Boards.h>\n#include <Firmata.h>\n\n'
	}, {
		name: 'GSM',
		code: '#include <GSM.h>\n#include <GSM3CircularBuffer.h>\n#include <GSM3IO.h>\n#include <GSM3MobileAccessProvider.h>\n#include <GSM3MobileCellManagement.h>\n#include <GSM3MobileClientProvider.h>\n#include <GSM3MobileClientService.h>\n#include <GSM3MobileDataNetworkProvider.h>\n#include <GSM3MobileMockupProvider.h>\n#include <GSM3MobileNetworkProvider.h>\n#include <GSM3MobileNetworkRegistry.h>\n#include <GSM3MobileServerProvider.h>\n#include <GSM3MobileServerService.h>\n#include <GSM3MobileSMSProvider.h>\n#include <GSM3MobileVoiceProvider.h>\n#include <GSM3ShieldV1.h>\n#include <GSM3ShieldV1AccessProvider.h>\n#include <GSM3ShieldV1BandManagement.h>\n#include <GSM3ShieldV1BaseProvider.h>\n#include <GSM3ShieldV1CellManagement.h>\n#include <GSM3ShieldV1ClientProvider.h>\n#include <GSM3ShieldV1DataNetworkProvider.h>\n#include <GSM3ShieldV1DirectModemProvider.h>\n#include <GSM3ShieldV1ModemCore.h>\n#include <GSM3ShieldV1ModemVerification.h>\n#include <GSM3ShieldV1MultiClientProvider.h>\n#include <GSM3ShieldV1MultiServerProvider.h>\n#include <GSM3ShieldV1PinManagement.h>\n#include <GSM3ShieldV1ScanNetworks.h>\n#include <GSM3ShieldV1ServerProvider.h>\n#include <GSM3ShieldV1SMSProvider.h>\n#include <GSM3ShieldV1VoiceProvider.h>\n#include <GSM3SMSService.h>\n#include <GSM3SoftSerial.h>\n#include <GSM3VoiceCallService.h>\n\n'
	}, {
		name: 'LiquidCrystal',
		code: '#include <LiquidCrystal.h>\n\n'
	}, {
		name: 'Robot Control',
		code: '#include <ArduinoRobot.h>\n#include <Arduino_LCD.h>\n#include <Compass.h>\n#include <EasyTransfer2.h>\n#include <EEPROM_I2C.h>\n#include <Fat16.h>\n#include <Fat16Config.h>\n#include <Fat16mainpage.h>\n#include <Fat16util.h>\n#include <FatStructs.h>\n#include <Multiplexer.h>\n#include <SdCard.h>\n#include <SdInfo.h>\n#include <Squawk.h>\n#include <SquawkSD.h>\n\n'
	}, {
		name: 'Robot IR Remote',
		code: '#include <IRremote.h>\n#include <IRremoteInt.h>\n#include <IRremoteTools.h>\n\n'
	}, {
		name: 'Robot Motor',
		code: '#include <ArduinoRobotMotorBoard.h>\n#include <EasyTransfer2.h>\n#include <LineFollow.h>\n#include <Multiplexer.h>\n\n'
	}, {
		name: 'SD',
		code: '#include <SD.h>\n\n'
	}, {
		name: 'SPI',
		code: '#include <SPI.h>\n\n'
	}, {
		name: 'Servo',
		code: '#include <Servo.h>\n\n'
	}, {
		name: 'SoftwareSerial',
		code: '#include <SoftwareSerial.h>\n\n'
	}, {
		name: 'SpacebrewYun',
		code: '#include <SpacebrewYun.h>\n\n'
	}, {
		name: 'Stepper',
		code: '#include <Stepper.h>\n\n'
	}, {
		name: 'TFT',
		code: '#include <TFT.h>\n\n'
	}, {
		name: 'Temboo',
		code: '#include <Temboo.h>\n\n'
	}, {
		name: 'WiFi',
		code: '#include <WiFi.h>\n#include <WiFiClient.h>\n#include <WiFiServer.h>\n#include <WiFiUdp.h>\n\n'
	}, {
		name: 'Wire',
		code: '#include <Wire.h>\n\n'
	}];

	var editor;
	var loginCheckTimer;

	function init() {
		initAjax();
		initSoftwareMenu();
		initEditor();
		initLogin();

		$('.header .tab li').on('click', onHeaderTabClick).eq(0).click();
		$('.hardware .tab li').on('click', onHardwareTabClick).hover(function(e){
			toggleWidth(e, 32);
		}, function(e){
			toggleWidth(e, 24);
		}).eq(0).click();
		$('.software .tab li').on('click', onSoftwareTabClick).hover(function(e){
			toggleWidth(e, 32);
		}, function(e){
			toggleWidth(e, 24);
		}).eq(0).click();
		$('.software .sub-tab li').on('click', onSoftwareSubTabClick).eq(1).click();
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function initSoftwareMenu() {
		var includeLi = $('.software .menu li[data-action="include"]');
		var ul = $('ul', includeLi).empty();
		for(var i = 0; i < includeConfigs.length; i++) {
			var config = includeConfigs[i];
			$('<li>\n\n').data('action', "includeLibrary").data('library', config.name).append($('<a href="#">\n\n').text(config.name)).appendTo(ul);
		}

		$('.software .menu li').on('click', onSoftwareMenuClick);
	}

	function initEditor() {
		editor = ace.edit($(".software .editor")[0]);
		editor.setTheme("ace/theme/monokai");
		editor.session.setMode("ace/mode/c_cpp");
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setValue(defaultCode, 1);
	}

	function initLogin() {
		$('.qrLoginBtn, .baseLoginBtn').on('click', function(e) {
			var action = $(this).attr("data-action");
			if (action == "qrLogin") {
				$(".qrLoginBtn, .qrLogin").removeClass("active");
				$(".baseLoginBtn, .baseLogin").addClass("active");
				$(".qrLoginBtn").css({
					display: "none"
				});
				$(".baseLoginBtn").css({
					display: "block"
				});
				$('#use_weixin').removeClass("active");
			} else {
				$(".baseLoginBtn, .baseLogin").removeClass("active");
				$(".qrLoginBtn, .qrLogin").addClass("active");
				$(".baseLoginBtn").css({
					display: "none"
				});
				$(".qrLoginBtn").css({
					display: "block"
				});
			}
		});

		$('#login_dialog .closeBtn').on('click', function(e) {
			$('#login_dialog').slideUp(0.1, function(event, ui) {
				$('#use_weixin').removeClass("active");
			});
			setLoginCheck(false);
		});


		$('.submitBtn').on('click', function() {
			$.ajax({
				url: '/snspostlogin', 
				data: {
					email: $('#email').val(),
					password: $('#password').val()
				},
				success: function(result) {
					if (result.code == 0) {
						//登录成功
						util.message(result.message);
						$('#login_dialog .closeBtn').fire('click');
					} else if (result.code == 1) {

					} else {
						$('.baseLogin .message span')
							.html(result.message)
							.delay(2000)
							.queue(function() {
								$(this).fadeOut().dequeue();
							});
					}
				}
			});
		});

		$('.qrLogin .qrcode').hover(function(e) {
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin');
			if (!use_weixin.is(':animated')) {
				use_weixin.addClass("active")
					.css({
						top: top - 160,
						left: left + 50,
						opacity: 0
					})
					.animate({
						left: left + 260,
						opacity: 1,
					}, {
						duration: 0.3,
					});
			}
		}, function(e) {
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin')
			if(!use_weixin.is(':animated')) {
				use_weixin.animate({
					left: left + 420,
					opacity: 0,
				}, {
					duration: 0.3,
					complete: function() {
						use_weixin.removeClass("active");
					},
				});
			}
		});
	}

	function onSoftwareMenuClick(e) {
		var node = $(this);
		var action = node.data('action');
		switch (action) {
			case 'save':
				onSaveClick(node, e);
				break;
			case 'download':
				onDownloadClick(node, e);
				break;
			case 'share':
				onShareClick(node, e);
				break;
			case 'includeLibrary':
				onIncludeLibraryClick(node, e);
				break;
		}
	}

	function onSaveClick(node, e) {
		$.ajax({
			type: 'GET',
			url: '/auth/check',
			dataType: 'json',
			success: function(result) {
				if(result.code == 0) {
					var projectData = {
						source: getSource(),
					}
					$.ajax({
						type: 'POST',
						url: '/project/save',
						data: {
							data: JSON.stringify(projectData),
							user_id: result.user.id,
						},
						dataType: 'json',
						success: function(res) {
							util.message(res.msg);
						}
					});
				} else {
					showLogin();
				}
			}
		});
	}

	function onDownloadClick(node, e) {
		var projectName = "Arduino";
		var buildType = "Arduino";

		$.ajax({
			type: "POST",
			url: "./build",
			data: {
				source: getSource(),
				projectName: projectName,
				buildType: buildType
			},
			dataType: "json",
			success: function(result) {
				if (result.code == 0 && result.url) {
					window.open(result.url);
				} else {
					util.message(result.msg);
				}
			},
			error: function(result) {

			}
		});
	}

	function onShareClick(node, e) {

	}

	function onIncludeLibraryClick(node, e) {
		var name = node.data('library');
		var includeConfig;
		for(var i = 0; i < includeConfigs.length; i++) {
			var config = includeConfigs[i];
			if(config.name == name) {
				includeConfig = config;
				break;
			}
		}

		if(!includeConfig) {
			return
		}

		var doc = editor.session.doc;
		doc.insert(doc.pos(0, 0), includeConfig.code);
	}

	function onHeaderTabClick(e) {
		var li = $(this);
		if (li.index() == 2) {
			return;
		}
		if (toggleActive(li)) {
			$('.content .mod').removeClass("active").eq(li.index()).addClass("active");
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
			$('.software .sub-mod').removeClass("active").eq(li.index()).addClass("active");
		}
	}

	function toggleActive(li) {
		if (li.hasClass("active")) {
			return false;
		}

		li.parent().find("li.active").removeClass("active");
		li.addClass("active");

		return true;
	}

	function toggleWidth(e, width) {
		var li = $(e.target);
		if(!li.is('li') || li.hasClass('active')) {
			return;
		}

		var duration = 100;
		li.animate({
			width: width
		}, duration);
	}

	function showLogin() {
		$('#login_dialog').css({
			top: -$(this).height(),
		}).show().animate({
			top: 100,
		}, {
			duration: 0.4,
			easing: "swing",
			complete: function() {
				setLoginCheck(true);
			},
		});
	}

	function setLoginCheck(value) {
		clearInterval(loginCheckTimer);
		if(value) {
			loginCheckTimer = setInterval(function() {
				var key = $('#qrcode_key').val();
				$.ajax({
					url: '/weixinlogin?key=' + key, 
					success: function(result) {
						if (result.code == 0) {
							//登录成功
							setLoginCheck(false);
							util.message(result.message);
							$('#login_dialog .closeBtn').click();
						} else if (result.code == 1) {
							//已经登录
							setLoginCheck(false);
							console.log(result.message);
						} else {
							//登录失败
						}
					},
				});
			}, 3000);
		}
	}

	function getSource() {
		var source = editor.getValue();
		var bytes = [];
		for (var i = 0; i < source.length; ++i) {
			bytes.push(source.charCodeAt(i));
		}
		return bytes;
	}

	return {
		init: init,
	}
});