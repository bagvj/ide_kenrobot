define(["goJS", "EventManager"], function(_, EventManager) {
	var GO = go.GraphObject.make;

	var defaultTextFont = "12px arial, Microsoft Yahei, Hiragino Sans GB, sans-serif";
	var defaultTextStoke = "white";

	//硬件节点模版
	var hardwareNodeTemplates = {
		"default": 
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("B", 2, go.Spot.Bottom)
			),
		"board":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("A", 1, new go.Spot(0.168, 0), "Rectangle", "#ccc", new go.Size(12, 15), go.Spot.Top),
				makePort("B", 1, new go.Spot(0.344, 0), "Rectangle", "#ccc", new go.Size(12, 15), go.Spot.Top),
				makePort("C", 1, new go.Spot(0.670, 0), "Rectangle", "#ccc", new go.Size(12, 15), go.Spot.Top),
				makePort("D", 1, new go.Spot(0.850, 0), "Rectangle", "#ccc", new go.Size(12, 15), go.Spot.Top),
				makePort("E", 1, new go.Spot(0.850, 1), "Rectangle", "#ccc", new go.Size(12, 15), go.Spot.Bottom),
				makePort("F", 1, new go.Spot(0.670, 1), "Rectangle", "#ccc", new go.Size(12, 15), go.Spot.Bottom)
				// makePort("G", 1, new go.Spot(0.344, 1), "Rectangle", "Yellow", new go.Size(12, 15))
			),
		"adapter":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 1, go.Spot.Top),
				makePort("B", 2, go.Spot.Bottom)
			),
	};

	//软件节点模版
	var softwareNodeTemplates = {
		"default": 
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top),
				makePort("B", 1, go.Spot.Bottom)
			),
		"start":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("B", 1, go.Spot.Bottom)
			),
		"loopStart":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top),
				makePort("B", 1, go.Spot.Bottom),
				makePort("L", 2, go.Spot.Left)
			),
		"loopEnd":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top),
				makePort("B", 1, go.Spot.Bottom),
				makePort("L", 1, go.Spot.Left)
			),
		"end":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top)
			),
		"ifElse":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top),
				makePort("L", 1, go.Spot.Left),
				makePort("R", 1, go.Spot.Right)
			),
		"while":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top),
				makePort("B", 1, go.Spot.Bottom),
				makePort("L", 2, go.Spot.Left),
				makePort("R", 1, go.Spot.Right)
			),
		"doWhile":
			GO(go.Node, "Spot",
				nodeStyle(),
				makeBody(),
				makePort("T", 2, go.Spot.Top),
				makePort("B", 1, go.Spot.Bottom),
				makePort("R", 1, go.Spot.Right),
				makePort("R", 1, go.Spot.Right)
			),
	};

	//连线模版
	var linkTemplate = GO(go.Link, {
			routing: go.Link.AvoidsNodes,
			corner: 5,
			relinkableFrom: false,
			relinkableTo: false,
			deletable: false,
			selectable: false,
		},
		new go.Binding("points").makeTwoWay(),
		GO(go.Shape, {
			name: "LINE",
			isPanelMain: true,
			stroke: "gray",
			strokeWidth: 2,
		}),
		GO(go.Shape, {
			name: "ARROW",
			toArrow: "standard",
			stroke: null,
			fill: "gray"
		})
	);

	var selectionTemplate = GO(go.Adornment, "Auto",
		GO(go.Shape, {
			fill: null,
			stroke: "deepskyblue",
			strokeWidth: 0.8,
			strokeDashArray: [4, 2],
		}),
		GO(go.Placeholder)
	);

	function nodeStyle() {
		return [
			new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
			new go.Binding("width"),
			new go.Binding("height"),
			new go.Binding("deletable"),
			new go.Binding("angle").makeTwoWay(),
			{
				cursor: "pointer",
				// selectionAdorned: false,
				locationSpot: go.Spot.Center,
				doubleClick: onDoubleClick,
				contextClick: onContextClick,
			}
		];
	}

	function makeBody(){
		return GO(go.Panel, "Auto",
			GO(go.Picture,
				new go.Binding("source")
			),
			GO(go.TextBlock, 
				{
					font: defaultTextFont,
					stroke: defaultTextStoke,
				},
				new go.Binding("text", "alias"),
				new go.Binding("visible", "textVisible")
			)
		);
	}

	function makePort(portId, linkType, spot, shape, fill, size, spot2) {
		return GO(go.Shape, shape || "Circle",
		{
			name: "PORT",
			portId: portId,
			fromLinkable: linkType == 1,
			toLinkable: linkType == 2,
			alignment: spot,
			alignmentFocus: spot,
			fromSpot: spot2 || spot,
			toSpot: spot2 || spot,
			fill: fill || "transparent",
			desiredSize: size || new go.Size(5, 5),
			stroke: null,
		});
	}

	//双击，编辑节点
	function onDoubleClick(e, node) {
		var name = e.diagram.model.name;
		EventManager.trigger(name, "editNode", {
			e: e,
			node: node,
		});
	}

	//右键，删除当前节点
	function onContextClick(e, node) {
		var diagram = e.diagram;
		diagram.clearSelection();
		diagram.select(node);
		diagram.commandHandler.deleteSelection();
	}

	return {
		hardware: {
			node: hardwareNodeTemplates,
			link: linkTemplate,
			selection: selectionTemplate,
		},
		software: {
			node: softwareNodeTemplates,
			link: linkTemplate,
			selection: selectionTemplate,
		},
	};
});