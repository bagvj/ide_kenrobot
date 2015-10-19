define(["jquery"],function($){
  
  var data;
  var getNodeInfoByKey;
  var controlList = ["flowchart_start_item",
                     "flowchart_tjfz_item",
                     "flowchart_tjxh_item",
                     "flowchart_yyxh_item",
                     "flowchart_jsxh_item"];
  var controlTypePoint = {
    "flowchart_start_item":{"name":"main","head":"TopCenter","body":null,"foot":["BottomCenter"]},
    "flowchart_tjfz_item":{"name":["if","else"],"head":"TopCenter","body":null,"foot":["LeftMiddle","RightMiddle"]},
    "flowchart_tjxh_item":{"name":"while","head":"TopCenter","body":"BottomCenter","foot":["RightMiddle"]},
    "flowchart_yyxh_item":{"name":"while","head":"TopCenter","body":"BottomCenter","foot":["RightMiddle"]},
    "flowchart_jsxh_item":{"name":"while","head":"TopCenter","body":"BottomCenter","foot":["RightMiddle"]},
  }

  function getIDByPrefix(prefix,nodes){
    for (var i = 0; i < nodes.length; i++) {
      if(nodes[i].id.indexOf(prefix)!=-1){
        return nodes[i];
      }
    };
    return null;
  }

  function getNodeByID(ID){
    var nodes = data.nodes
    for (var i = 0; i < nodes.length; i++) {
      if(nodes[i].id == ID){
        return nodes[i];
      }
    };
    return null;
  }

  function getProperty(node,isHardware){
    if(node==null)
      return "";
    if(typeof(node.add_info)!="undefined" &&
       typeof(node.add_info.property)!="undefined" &&
       node.add_info.property != "")
      if(!isHardware)
        return "(" + node.add_info.property + ")";
      else
        return node.add_info.property
    else
      return "";
  }

  function getTargetIDBySourceID(sourceID,links){
    for (var i = 0; i < links.length; i++) {
      if(links[i].source_id == sourceID){
        return links[i];
      }
    };
    return null;
  }

  function getIDByID(ID){
    var values = ID.split("_").slice(0, -1);
    return values.join("_");
  }

  function getTypeByID(ID){
    var type = ID.split("_");
    type = type[0]+"_"+type[1]+"_item";
    return type;
  }

  function getNameByType(type){
    var type_info = controlTypePoint[type];
    if(typeof(type_info)=="undefined"){
      return {"name":""};
    }
    return type_info;
  }

  function getBodyByType(type){
    var type_info = controlTypePoint[type];
    if(typeof(type_info)=="undefined"){
      return {"body":null};
    }
    return type_info;
  }

  function getFootByType(type){
    var type_info = controlTypePoint[type];
    if(typeof(type_info)=="undefined"){
      return {"foot":["BottomCenter"]};
    }
    return type_info;
  }

  function getSpace(index){
    var space = "";
    for (var i = 0; i < index; i++) {
      space += "    ";
    };
    return space;
  }

  function getFuncByType(type){
    return getNodeInfoByKey(type,"func");
  }

  function getInitFuncByType(type){
    return getNodeInfoByKey(type,"init_func");
  }

  function createStruct(startID,links,end,index){
    var str = "";
    if(controlList.indexOf(getTypeByID(startID))==-1){
      //console.log(getSpace(index)+getIDByID(startID));
      var flowchartID = getTypeByID(getIDByID(startID));
      var code = getFuncByType(flowchartID);
      var initCode = getInitFuncByType(flowchartID);
      var codeVar = getHardwareInfo(getIDByID(startID));
      var property = getProperty(getNodeByID(getIDByID(startID)),true)
      initStr.push(addPropertyForCode(addVarForCode(initCode,codeVar),property));
      if(code)
        code = addPropertyForCode(addVarForCode(code,codeVar),property);
      else
        code = "//无";
      str += getSpace(index+1) + code;
      str += "\n";
    }
    var targetID = getTargetIDBySourceID(startID,links).target_id;
    if(targetID.indexOf(end)!=-1){
      return str;
    }
    var type = getTypeByID(targetID);
    var name = getBodyByType(type).name;
    var body = getBodyByType(type).body;
    if(body!=null){
      var startID = targetID.replace("TopCenter",body);
      //console.log(getSpace(index)+name+"{")
      str += getSpace(index+1) + name + getProperty(getNodeByID(getIDByID(targetID)),false) + "{";
      str += "\n";
      str += createStruct(startID,links,targetID.replace("TopCenter","LeftMiddle"),index+1);
      //console.log(getSpace(index)+"}")
      str += getSpace(index+1) + "}";
      str += "\n";
    }
    var foot = getFootByType(type).foot;
    for (var i = 0; i < foot.length; i++) {
      var startID = targetID.replace("TopCenter",foot[i]);
      if(foot.length==2){
        //console.log(getSpace(index)+name[i]+"{")
        var property="";
        if(i==0)
          property = getProperty(getNodeByID(getIDByID(targetID)),false);
        str += getSpace(index+1) + name[i] + property + "{";
        str += "\n";
        str+=createStruct(startID,links,end,index+1);
        //console.log(getSpace(index)+"}")
        str += getSpace(index+1) + "}";
        str += "\n";
      }else{
        str+=createStruct(startID,links,end,index);
      }
    };
    return str;
  }

  function init(value,func){
    data = value;
    getNodeInfoByKey = func;
  }

  function generateMain(){
    //console.log("main(){");
    var str="int main(){\n";
    str += getSpace(1)+"Init();\n";
    str += getSpace(1)+"sei();\n";
    var node = getIDByPrefix("flowchart_start",data.nodes);
    if(node != null){
      var startID = node.id + "_BottomCenter";
      str += createStruct(startID,data.links,"flowchart_end",0); 
    }
    //console.log("}");
    str += getSpace(1) + "return 0;\n";
    str += "}\n";
    return str;
  }

  function generateInit(){
    var str="void Init(){\n";
    str += getSpace(1)+"initTimer3();\n";
    for (var i = 0; i < initStr.length; i++) {
      if(initStr[i]){
        str += getSpace(1)+initStr[i]+"\n";
      }else{
        str += getSpace(1)+"//无\n";
      }
    };
    str += "}\n";
    return str;
  }

  var initStr = [];
  function generateCode(){
    initStr = [];
    var mainStr = generateMain();
    var str = '#include"Device.h"';
    str += "\n";
    str += "long result = 0;\n";
    str += generateInit();
    str += mainStr;
    return str;
  }

  function getHardwareInfo(hardwareID){
    var hardwareID = getIDByID(hardwareID);
    var content = $("#"+hardwareID+"").parent().html();
    content = content.split(">");
    content = content[content.length-1].split("(");
    if(content.length<2)
      return null;
    content = content[content.length-1].split(")");
    return {port:content[0][0],
            bit:content[0][1]};
  }

  function addVarForCode(code,value){
    if(!code){
      return "//无";
    }
    if(value==null){
      return code;
    }else{
      code = code.replace("X","'"+value["port"]+"'");
      code = code.replace(", n",", "+value["bit"]);
      return code;
    }
  }

  function addPropertyForCode(code,property){
    if(!code){
      return "//无";
    }
    if(!property){
      return code;
    }else{
      code = code.replace("DigitalValue",""+property+"");
      return code;
    }
  }

  return {
    init:init,
    generateMain:generateCode
  }

});
