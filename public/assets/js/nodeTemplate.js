define(["goJS", "EventManager"], function(_, EventManager) {
	var GO = go.GraphObject.make;

	var defaultTextFont = "12px arial, Microsoft Yahei, Hiragino Sans GB, sans-serif";
	var defaultTextStroke = "white";

	var oldLinkColor;
	var enterLinkColor = "orange";

	function init() {
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
					makePort("B", 1, go.Spot.Bottom),
					makeToolTip()
				),
			"start":
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("B", 1, go.Spot.Bottom),
					makeToolTip()
				),
			"loopStart":
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("T", 2, go.Spot.Top),
					makePort("B", 1, go.Spot.Bottom),
					makePort("L", 2, go.Spot.Left),
					makeToolTip()
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
					makePort("R", 1, go.Spot.Right),
					makeToolTip()
				),
			"while":
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("T", 2, go.Spot.Top),
					makePort("B", 1, go.Spot.Bottom),
					makePort("L", 2, go.Spot.Left),
					makePort("R", 1, go.Spot.Right),
					makeToolTip()
				),
			"doWhile":
				GO(go.Node, "Spot",
					nodeStyle(),
					makeBody(),
					makePort("T", 2, go.Spot.Top),
					makePort("B", 1, go.Spot.Bottom),
					makePort("R", 1, go.Spot.Right),
					makePort("R", 1, go.Spot.Right),
					makeToolTip()
				),
		};

		//硬件连线模版
		var hardwareLinkTemplate = GO(go.Link, {
				routing: go.Link.AvoidsNodes,
				corner: 5,
				relinkableFrom: false,
				relinkableTo: false,
				deletable: false,
				selectable: false,
				adjusting: go.Link.End,
				mouseEnter: onLinkMouseEnter,
				mouseLeave: onLinkMouseLeave,
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

		var softwareLinkTemplate = GO(SoftwareLink, {
				routing: go.Link.AvoidsNodes,
				corner: 5,
				relinkableFrom: false,
				relinkableTo: false,
				deletable: false,
				selectable: false,
				adjusting: go.Link.End,
				mouseEnter: onLinkMouseEnter,
				mouseLeave: onLinkMouseLeave,
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
			}),
			GO(go.TextBlock, {
					font: defaultTextFont,
					stroke: "#17b7eb",
					segmentIndex: 0,
					segmentOrientation: go.Link.OrientUpright
				},
				new go.Binding("text"),
				new go.Binding("segmentOffset", "", function(data) {
					return data.text == "Yes" ? new go.Point(10, 10): new go.Point(10, -10);
				}))
		);

		//选中模版
		var selectionTemplate = GO(go.Adornment, "Auto",
			GO(go.Shape, {
				fill: null,
				stroke: "deepskyblue",
				strokeWidth: 0.8,
				strokeDashArray: [4, 2],
			}),
			GO(go.Placeholder)
		);

		return {
			hardware: {
				node: hardwareNodeTemplates,
				link: hardwareLinkTemplate,
				selection: selectionTemplate,
			},
			software: {
				node: softwareNodeTemplates,
				link: softwareLinkTemplate,
				selection: selectionTemplate,
			},
		};
	}

	//节点样式
	function nodeStyle() {
		return [
			new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
			new go.Binding("width"),
			new go.Binding("height"),
			new go.Binding("deletable"),
			new go.Binding("angle").makeTwoWay(),
			{
				cursor: "pointer",
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
					stroke: defaultTextStroke,
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

	function makeToolTip() {
		return {
			toolTip:
				GO(go.Adornment, "Auto",
					GO(go.Shape, {fill: "#dcdcdc", stroke: null}),
					GO(go.TextBlock, { 
							margin: 10,
							font: "12px SourceCodePro-Regular",
							stroke: "#666",
						},
						new go.Binding("text", "code"))
				)
		}
	}

	function onLinkMouseEnter(e, link) {
		oldLinkColor = link.findObject("ARROW").fill;
		link.findObject("LINE").stroke = enterLinkColor;
		link.findObject("ARROW").fill = enterLinkColor;
	}

	function onLinkMouseLeave(e, link) {
		link.findObject("LINE").stroke = oldLinkColor;
		link.findObject("ARROW").fill = oldLinkColor;
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

	//软件连线
	function SoftwareLink() {
		go.Link.call(this);
	};
	go.Diagram.inherit(SoftwareLink, go.Link);

	//自定义函数，查找边界
	SoftwareLink.prototype.findBound = function(fromNode, toNode, boundType) {
		var toVisitNodes = [fromNode];
		var visitedNodes = [];
		var targetNodes = [];
		while(toVisitNodes.length > 0) {
			var node = toVisitNodes.pop();
			visitedNodes.push(node);
			if(targetNodes.indexOf(node) < 0) {
				targetNodes.push(node);
			}
			var outNodes = node.findNodesOutOf();
			var iter = outNodes.iterator;
			while(iter.next()) {
				if(visitedNodes.indexOf(iter.value) < 0){
					toVisitNodes.push(iter.value);
				}
			}
		}

		var bound;
		if(boundType == "minX") {
			bound = Number.MAX_VALUE;
			for(var i = 0; i < targetNodes.length; i++) {
				var node = targetNodes[i];
				var bounds = node.actualBounds;
				if(bounds.x < bound) {
					bound = bounds.x;
				}
			}
		} else {
			bound = Number.MIN_VALUE;
			for(var i = 0; i < targetNodes.length; i++) {
				var node = targetNodes[i];
				var bounds = node.actualBounds;
				if(bounds.x > bound) {
					bound = bounds.x;
				}
			}
		}
		
		return bound;
	};

	//重新计算连线上的点
	SoftwareLink.prototype.computePoints = function() {
		var fromNode = this.fromNode;
		var toNode = this.toNode;
		var fromNodeData = fromNode.data;
		var toNodeData = toNode.data;
		if(fromNodeData.tag == 1 && toNodeData.tag == 1 && fromNodeData.subTag == 3 && toNodeData.subTag == 2) {
			var minX = this.findBound(toNode, fromNode, "minX");
			minX = minX - 20;

			var fromBounds = fromNode.actualBounds;
			var toBounds = toNode.actualBounds;
			var x1 = fromBounds.x;
			var y1 = fromBounds.y + fromBounds.height / 2;
			var x2 = toBounds.x;
			var y2 = toBounds.y + toBounds.height / 2;

			this.clearPoints();
			this.addPoint(new go.Point(x1, y1));
			this.addPoint(new go.Point(minX, y1));
			this.addPoint(new go.Point(minX, y2));
			this.addPoint(new go.Point(x2, y2));
			return true;
		} else {
			return go.Link.prototype.computePoints.call(this);
		}
	};

	return init();
});