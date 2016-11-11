ace.define("ace/theme/arduino",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.iswhite = true;
exports.cssClass = "ace-arduino";
exports.cssText = ".ace-arduino .ace_gutter {\
background: #dedfe0;\
color: #333;\
}\
.ace-arduino .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-arduino {\
background-color: #f6f6f6;\
color: #333;\
}\
.ace-arduino .ace_cursor {\
color: #515151;\
}\
.ace-arduino .ace_marker-layer .ace_selection {\
background-color: rgba(255, 180, 72, 0.2);\
}\
.ace-arduino.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-arduino .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-arduino .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-arduino .ace_marker-layer .ace_active-line {\
background: #f3efc0;\
}\
.ace-arduino .ace_gutter-active-line {\
background-color: transparent;\
}\
.ace-arduino .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-arduino .ace_invisible {\
color: #52524d\
}\
.ace-arduino .ace_entity.ace_name.ace_tag,\
.ace-arduino .ace_keyword,\
.ace-arduino .ace_meta.ace_tag,\
.ace-arduino .ace_storage {\
color: #f66f6f;\
}\
.ace-arduino .ace_punctuation,\
.ace-arduino .ace_punctuation.ace_tag {\
color: #333;\
}\
.ace-arduino .ace_constant.ace_character,\
.ace-arduino .ace_constant.ace_language {\
color: #AE81FF\
}\
.ace-arduino .ace_constant.ace_other {\
color: #12a9df;\
}\
.ace-arduino .ace_constant.ace_numeric{\
color: #ef3c97;\
}\
.ace-arduino .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-arduino .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-arduino .ace_support.ace_constant,\
.ace-arduino .ace_support.ace_function {\
color: #ffa24d\
}\
.ace-arduino .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-arduino .ace_storage.ace_type,\
.ace-arduino .ace_support.ace_class,\
.ace-arduino .ace_support.ace_type {\
color: #6f9fc5;\
}\
.ace-arduino .ace_entity.ace_name.ace_function,\
.ace-arduino .ace_entity.ace_other,\
.ace-arduino .ace_entity.ace_other.ace_attribute-name,\
.ace-arduino .ace_variable {\
color: #A6E22E\
}\
.ace-arduino .ace_variable.ace_parameter {\
color: #FD971F\
}\
.ace-arduino .ace_string {\
color: #eaa801;;\
}\
.ace-arduino .ace_comment {\
color: #94a5a6;\
}\
.ace-arduino .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}\
.ace_gutter-cell {\
	padding-left: 19px;\
}\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #02979d;\
}\
.ace_editor.ace_autocomplete .ace_line.ace_selected {\
    color: white;\
}\
.ace_editor.ace_autocomplete {\
	border: none;\
}\
.ace_editor.ace_autocomplete .ace_completion-highlight {\
    color: #12a9df;\
    text-shadow: none;\
}\
.ace_editor.ace_autocomplete .ace_selected .ace_completion-highlight {\
  color: #42d3fb;\
}\
.ace_editor.ace_autocomplete .ace_line-hover {\
    border: none;\
    margin-top: 0;\
    background: #dfeafa;\
}\
.ace_rightAlignedText {\
    display: none;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar-track {\
  -webkit-box-shadow: none;\
  background-color: #DFE1E5;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar {\
  background-color: #DFE1E5;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar-thumb {\
  background-color: #c1c1c1;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar-track {\
  -webkit-box-shadow: none;\
  background-color: #DFE1E5;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar {\
  background-color: #DFE1E5;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar-thumb {\
  background-color: #c1c1c1;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
