define(function() {
	var boards = {
		ArduinoUNO: {
			width: 355,
			height: 265,
			category: "ArduinoUNO",
		},
	};

	var components = {
		buzzer: {
			width: 85,
			height: 80,
			varName: "buzzer_",
			category: "one-port-bottom",
			headCode: '',
			varCode: 'int $NAME = $P0;\n',
			setupCode: '',
		},
		continuousServo: {
			width: 125,
			height: 106,
			varName: "servo_cont_",
			category: "one-port-bottom",
			headCode: '#include <Servo.h>\n',
			varCode: "Servo $NAME;\n",
			setupCode: "$NAME.attach($P0);\n",
		},
		lcd: {
			width: 170,
			height: 92,
			varName: "lcd_",
			category: "two-port-top",
			headCode: '#include <Wire.h>\n#include <bqLiquidCrystal.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n',
			varCode: "LiquidCrystal $NAME($P0);\n",
			setupCode: "$NAME.begin(16, 2);\n$NAME.clear();\n",
		},
		led: {
			width: 55,
			height: 83,
			varName: "led_",
			category: "one-port-bottom",
			headCode: '',
			varCode: 'int $NAME = $P0;\n',
			setupCode: 'pinMode($NAME, OUTPUT);\n',
		},
		ultrasoundSensor: {
			width: 120,
			height: 79,
			varName: "ultrasound_sensor_",
			category: "two-port-bottom",
			headCode: '#include <US.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n',
			varCode: 'US $NAME($P0, $P1);\n',
			setupCode: '',
		},
		button: {
			width: 90,
			height: 73,
			varName: "button_",
			category: "one-port-bottom",
			headCode: '',
			varCode: 'int $NAME = $P0;\n',
			setupCode: 'pinMode($NAME, INPUT);\n',
		},
		buttonPanel: {
			width: 165,
			height: 120,
			varName: "button_panel_",
			category: "one-port-top",
			headCode: '#include <ButtonPad.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n',
			varCode: 'ButtonPad $NAME($P0);\n',
			setupCode: '',
		},
		infraredSensor: {
			width: 90,
			height: 78,
			varName: "infrared_sensor_",
			category: "one-port-bottom",
			headCode: '',
			varCode: 'int $NAME = $P0;\n',
			setupCode: 'pinMode($NAME, INPUT);\n',
		},
		lineFollower: {
			width: 95,
			height: 87,
			varName: "line_follower_",
			category: "two-port-bottom",
			headCode: '#include <LineFollower.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n',
			varCode: 'LineFollower $NAME($P0, $P1);\n',
			setupCode: '',
		},
		joystick: {
			width: 100,
			height: 101,
			varName: "joystick_",
			category: "joystick",
			headCode: '#include <Joystick.h>\n#include <Wire.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n',
			varCode: 'Joystick $NAME($P1, $P2, $P0);\n',
			setupCode: '',
		},
		lightSensor: {
			width: 90,
			height: 64,
			varName: "light_sensor_",
			category: "one-port-top",
			headCode: '',
			varCode: 'int $NAME = $P0;\n',
			setupCode: 'pinMode($NAME, INPUT);\n',
		},
		potentiometer: {
			width: 65,
			height: 103,
			varName: "potentiometer_",
			category: "one-port-top",
			headCode: '',
			varCode: 'int $NAME = $P0;\n',
			setupCode: 'pinMode($NAME, INPUT);\n',
		},
		bluetooth: {
			width: 115,
			height: 88,
			varName: "bluetooth_",
			category: "two-port-bottom",
			headCode: '#include <SoftwareSerial.h>\n#include <bqSoftwareSerial.h>\n#include <Servo.h>\n#include <Wire.h>\n',
			varCode: 'bqSoftwareSerial $NAME($P0, $P1, 9600);\n',
			setupCode: '',
		},
		serialPort: {
			width: 115,
			height: 71,
			varName: "serial_port_",
			category: "one-port-right",
			headCode: '#include <SoftwareSerial.h>\n#include <bqSoftwareSerial.h>\n#include <Servo.h>\n#include <Wire.h>\n',
			varCode: 'bqSoftwareSerial $NAME(0, 1, 9600);\n',
			setupCode: '',
		},
		servo: {
			width: 125,
			height: 106,
			varName: "servo_",
			category: "one-port-bottom",
			headCode: '#include <Servo.h>\n',
			varCode: 'Servo $NAME;\n',
			setupCode: '$NAME.attach($P0);\n',
		},
	};

	function init() {
		for(var name in boards) {
			var board = boards[name];
			board.name = name;
			board.source = "assets/images/board/" + name + ".svg";
			board.selectable = false;
			board.deletable = false;
			board.type = "board";
		}

		for(var name in components) {
			var component = components[name];
			component.name = name;
			component.source = "assets/images/component/" + name + ".svg";
			component.selectable = true;
			component.deletable = true;
			component.type = "component";
		}

		return {
			boards: boards,
			components: components,
		};
	}

	return init();
});