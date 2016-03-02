define(["goJS", "EventManager"], function(_, EventManager) {
	var GO = go.GraphObject.make;

	var defaultTextFont = "14px Microsoft Yahei";
	var oldLinkColor = "#F1C933";
	var enterLinkColor = "#F19833";
	var oldPortColor = "#ffe42b";
	var enterPortColor = "#F19833";

	function init() {
		var boardPortSize = new go.Size(9, 15);
		var defaultPortSize = new go.Size(14, 14);
		var offset = 3;
		//节点模版
		var nodeTemplates = {
			"ArduinoUNO":
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("0", new go.Spot(0.947, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("1", new go.Spot(0.912, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("2", new go.Spot(0.877, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("3", new go.Spot(0.842, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("4", new go.Spot(0.807, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("5", new go.Spot(0.772, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("6", new go.Spot(0.737, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("7", new go.Spot(0.702, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("8", new go.Spot(0.653, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("9", new go.Spot(0.618, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("10", new go.Spot(0.583, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("11", new go.Spot(0.548, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("12", new go.Spot(0.513, 0.037), "Rectangle", "#F1C933", boardPortSize),
					makePort("13", new go.Spot(0.478, 0.037), "Rectangle", "#F1C933", boardPortSize),


					makePort("A0", new go.Spot(0.771, 0.984), "Rectangle", "#F1C933", boardPortSize),
					makePort("A1", new go.Spot(0.806, 0.984), "Rectangle", "#F1C933", boardPortSize),
					makePort("A2", new go.Spot(0.841, 0.984), "Rectangle", "#F1C933", boardPortSize),
					makePort("A3", new go.Spot(0.876, 0.984), "Rectangle", "#F1C933", boardPortSize),
					makePort("A4", new go.Spot(0.911, 0.984), "Rectangle", "#F1C933", boardPortSize),
					makePort("A5", new go.Spot(0.946, 0.984), "Rectangle", "#F1C933", boardPortSize),

					makePort("SerialPort", new go.Spot(0.0089, 0.248), "Rectangle", "#F1C933", new go.Size(30, 65))
				),
			"one-port-top": 
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("P0", new go.Spot(0.5, 0, 0, -offset), null, "#F1C933", defaultPortSize, "#F19833")
				),
			"one-port-bottom": 
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("P0", new go.Spot(0.5, 1, 0, offset), null, "#F1C933", defaultPortSize, "#F19833")
				),
			"one-port-right": 
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("P0", new go.Spot(1, 0.5, offset, 0), null, "#F1C933", defaultPortSize, "#F19833")
				),
			"two-port-top": 
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("P0", new go.Spot(0.333, 0, 0, -offset), null, "#F1C933", defaultPortSize, "#F19833"),
					makePort("P1", new go.Spot(0.667, 0, 0, -offset), null, "#F1C933", defaultPortSize, "#F19833")
				),
			"two-port-bottom": 
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("P0", new go.Spot(0.333, 1, 0, offset), null, "#F1C933", defaultPortSize, "#F19833"),
					makePort("P1", new go.Spot(0.667, 1, 0, offset), null, "#F1C933", defaultPortSize, "#F19833")
				),
			"joystick": 
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("P0", new go.Spot(0.5, 0, 0, -offset), null, "#F1C933", defaultPortSize, "#F19833"),
					makePort("P1", new go.Spot(0.333, 1, 0, offset), null, "#F1C933", defaultPortSize, "#F19833"),
					makePort("P2", new go.Spot(0.667, 1, 0, offset), null, "#F1C933", defaultPortSize, "#F19833")
				),
		};

		//硬件连线模版
		var linkTemplate = GO(go.Link, {
				routing: go.Link.AvoidsNodes,
				corner: 5,
				click: onLinkClick,
			},
			new go.Binding("points").makeTwoWay(),
			GO(go.Shape, {
				name: "LINE",
				isPanelMain: true,
				fill: "#95a3ad",
				stroke: "#95a3ad",
				strokeWidth: 3,
			})
		);

		//节点选中模版
		var nodeSelectionTemplate = GO(go.Adornment, "Auto",
			// new go.Binding("width"),
			// new go.Binding("height"),
			GO(go.Shape, 
				{
					fill: null,
					stroke: "#1ca8f8",
					strokeWidth: 2,
				}
			),
			GO(go.Placeholder)
		);

		//连线选中模版
		var linkSelectionTemplate = GO(go.Adornment, "Link",
			GO(go.Shape, {
				isPanelMain: true,
				stroke: "#F19833",
				strokeWidth: 0,
			})
		);

		return {
			node: nodeTemplates,
			link: linkTemplate,
			nodeSelection: nodeSelectionTemplate,
			linkSelection: linkSelectionTemplate,
		};
	}

	//节点样式
	function nodeStyle() {
		return [
			new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
			new go.Binding("selectable"),
			new go.Binding("deletable"),
			new go.Binding("angle").makeTwoWay(),
			{
				cursor: "pointer",
				locationSpot: go.Spot.Center,
				click: onNodeClick,
				toolTip: GO(go.Adornment, "Auto",
					GO(go.Shape, 
						{
							fill: "#F1C933",
							stroke: null,
						}
					),
					GO(go.TextBlock,
						{
							margin: 10,
							font: defaultTextFont,
							stroke: "#69550B",
						},
						new go.Binding("text", "label")
					)
				)
			}
		];
	}

	function makeBody(){
		return GO(go.Picture,
			new go.Binding("source"),
			new go.Binding("width"),
			new go.Binding("height")
		);
	}

	function makePort(portId, spot, shape, fill, size, stroke) {
		return GO(go.Shape, shape || "Circle",
		{
			name: "PORT",
			fromLinkable: true,
			toLinkable: true,
			portId: portId,
			alignment: spot,
			alignmentFocus: spot,
			fill: fill || "transparent",
			desiredSize: size || new go.Size(5, 5),
			stroke: stroke || null,
			cursor: "crosshair",
			click: onPortClick,
			mouseEnter: onPortMouseEnter,
			mouseLeave: onPortMouseLeave,
			toolTip: GO(go.Adornment, "Auto",
				GO(go.Shape, 
					{
						fill: "#F1C933",
						stroke: null,
					}
				),
				GO(go.TextBlock,
					{
						margin: 10,
						font: defaultTextFont,
						stroke: "#69550B",
					},
					new go.Binding("text", "", function(nodeData) {
						var ports = nodeData.ports;
						var port = ports[portId];
						if(nodeData.type == "component" || port.type == 3) {
							return port.label;
						} else {
							return "Pin " + port.label;
						}
					})
				)
			)
		});
	}

	function onNodeClick(e, node) {
		EventManager.trigger("hardware", "nodeClick", node);
		e.handled = true;
	}

	function onLinkClick(e, link) {
		EventManager.trigger("hardware", "linkClick", link);
		e.handled = true;
	}

	function onPortClick(e, port) {
		EventManager.trigger("hardware", "portClick", port);
		e.handled = true;
	}

	function onPortMouseEnter(e, port) {
		oldPortColor = port.fill;
		port.fill = enterPortColor;
	}

	function onPortMouseLeave(e, port) {
		port.fill = oldPortColor;
	}

	return init();
});