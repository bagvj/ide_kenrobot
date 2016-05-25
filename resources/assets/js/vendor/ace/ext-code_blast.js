"use strict";
ace.define("ace/ext/code_blast", ["require", "exports", "module", "ace/editor", "ace/config"], function(require, exports, module) {
	var shakeTime = 0,
		shakeTimeMax = 0,
		shakeIntensity = 5,
		lastTime = 0,
		particles = [],
		particlePointer = 0,
		MAX_PARTICLES = 500,
		PARTICLE_NUM_RANGE = { min: 5, max: 10 },
		PARTICLE_GRAVITY = 0.08,
		PARTICLE_ALPHA_FADEOUT = 0.96,
		PARTICLE_VELOCITY_RANGE = {
			x: [-1, 1],
			y: [-3.5, -1.5]
		},
		w = window.innerWidth,
		h = window.innerHeight,
		isActive = false,
		options = {};

	var editor, editorNode;
	var canvas, ctx;
	var throttledShake = throttle(shake, 100);
	var throttledSpawnParticles = throttle(spawnParticles, 100);

	function getRGBComponents() {
		if(options.color == "random") {
			return [random(255), random(255), random(255)];
		} else {
			return options.color;
		}
	}

	function spawnParticles() {
		var pos = editor.getCursorPositionScreen();
		pos = editor.renderer.textToScreenCoordinates(pos.row, pos.column);
		pos = {left: pos.pageX, top: pos.pageY};
		var numParticles = random(PARTICLE_NUM_RANGE.min, PARTICLE_NUM_RANGE.max);
		var color = getRGBComponents();
		for (var i = numParticles; i--;) {
			particles[particlePointer] = createParticle(pos.left + 10, pos.top, color);
			particlePointer = (particlePointer + 1) % MAX_PARTICLES;
		}
	}

	function createParticle(x, y, color) {
		var p = {
			x: x,
			y: y + 10,
			alpha: 1,
			color: color
		};
		if (options.effect === 1) {
			p.size = random(2, 4);
			p.vx = PARTICLE_VELOCITY_RANGE.x[0] + Math.random() *
					(PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]);
			p.vy = PARTICLE_VELOCITY_RANGE.y[0] + Math.random() *
					(PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0]);
		} else if (options.effect === 2) {
			p.size = random(2, 8);
			p.drag = 0.92;
			p.vx = random(-3, 3);
			p.vy = random(-3, 3);
			p.wander = 0.15;
			p.theta = random(0, 360) * Math.PI / 180;
		}
		return p;
	}

	function effect1(particle) {
		particle.vy += PARTICLE_GRAVITY;
		particle.x += particle.vx;
		particle.y += particle.vy;

		particle.alpha *= PARTICLE_ALPHA_FADEOUT;

		ctx.fillStyle = 'rgba('+ particle.color[0] +','+ particle.color[1] +','+ particle.color[2] + ',' + particle.alpha + ')';
		ctx.fillRect(Math.round(particle.x - 1), Math.round(particle.y - 1), particle.size, particle.size);
	}

	// Effect based on Soulwire's demo: http://codepen.io/soulwire/pen/foktm
	function effect2(particle) {
		particle.x += particle.vx;
		particle.y += particle.vy;
		particle.vx *= particle.drag;
		particle.vy *= particle.drag;
		particle.theta += random( -0.5, 0.5 );
		particle.vx += Math.sin( particle.theta ) * 0.1;
		particle.vy += Math.cos( particle.theta ) * 0.1;
		particle.size *= 0.96;

		ctx.fillStyle = 'rgba('+ particle.color[0] +','+ particle.color[1] +','+ particle.color[2] + ',' + particle.alpha + ')';
		ctx.beginPath();
		ctx.arc(Math.round(particle.x - 1), Math.round(particle.y - 1), particle.size, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawParticles(timeDelta) {
		var particle;
		for (var i = particles.length; i--;) {
			particle = particles[i];
			if (!particle || particle.alpha < 0.01 || particle.size <= 0.5) { continue; }

			if (options.effect === 1) { effect1(particle); }
			else if (options.effect === 2) { effect2(particle); }
		}
	}

	function shake(time) {
		shakeTime = shakeTimeMax = time;
	}

	function random(min, max) {
		if (!max) { max = min; min = 0; }
		return min + ~~(Math.random() * (max - min + 1))
	}

	function throttle (callback, limit) {
		var wait = false;
		return function () {
			if (!wait) {
				callback.apply(this, arguments);
				wait = true;
				setTimeout(function () {
					wait = false;
				}, limit);
			}
		}
	}

	function loop() {
		if (!isActive) { return; }

		ctx.clearRect(0, 0, w, h);

		// get the time past the previous frame
		var current_time = new Date().getTime();
		if(!lastTime) lastTime = current_time;
		var dt = (current_time - lastTime) / 1000;
		lastTime = current_time;

		if (shakeTime > 0) {
			shakeTime -= dt;
			var magnitude = (shakeTime / shakeTimeMax) * shakeIntensity;
			var shakeX = random(-magnitude, magnitude);
			var shakeY = random(-magnitude, magnitude);
			editorNode.style.transform = 'translate(' + shakeX + 'px,' + shakeY + 'px)';
		}
		drawParticles();
		requestAnimationFrame(loop);
	}

	function onEditorChange() {
		if(options.shake) {
			throttledShake(0.3);
		}
		throttledSpawnParticles();
	}

	function init(_editor, opt) {
		editor = _editor;
		editorNode = editor.container;
		options = {
			effect: opt.effect || 2,
			shake: opt.shake || false,
			color: opt.color || "random",
		};

		canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d'),

		canvas.id = 'code-blast-canvas'
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.zIndex = 1;
		canvas.style.pointerEvents = 'none';
		canvas.width = w;
		canvas.height = h;

		document.body.appendChild(canvas);

		isActive = true;
		loop();

		editor.on("change", onEditorChange);
	}

	function destroy() {
		isActive = false;
		editor.off('change', onEditorChange);
		if (canvas) { canvas.remove(); }
	}

	var Editor = require("../editor").Editor;
	require("../config").defineOptions(Editor.prototype, "editor", {
		blastCode: {
			set: function(val) {
				if(val) {
					init(this, val);
				} else {
					destroy();
				}
			},
			initialValue: false,
		},
	});
});

(function() {
	ace.require(["ace/ext/code_blast"], function() {});
})();