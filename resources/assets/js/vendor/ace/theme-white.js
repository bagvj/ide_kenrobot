ace.define("ace/theme/white",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.iswhite = true;
exports.cssClass = "ace-white";
exports.cssText = ".ace-white .ace_gutter {\
background: #e1e4e8;\
color: #979797;\
}\
.ace-white .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-white {\
background-color: #f6f6f6;\
color: #333;\
}\
.ace-white .ace_cursor {\
color: #515151;\
}\
.ace-white .ace_marker-layer .ace_selection {\
background-color: rgba(0, 154, 255, 0.3)\
}\
.ace-white.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-white .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-white .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-white .ace_marker-layer .ace_active-line {\
background: #f3efc0;\
}\
.ace-white .ace_gutter-active-line {\
background-color: transparent;\
}\
.ace-white .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-white .ace_invisible {\
color: #52524d\
}\
.ace-white .ace_entity.ace_name.ace_tag,\
.ace-white .ace_keyword,\
.ace-white .ace_meta.ace_tag,\
.ace-white .ace_storage {\
color: #f66f6f;\
}\
.ace-white .ace_punctuation,\
.ace-white .ace_punctuation.ace_tag {\
color: #333;\
}\
.ace-white .ace_constant.ace_character,\
.ace-white .ace_constant.ace_language {\
color: #AE81FF\
}\
.ace-white .ace_constant.ace_other {\
color: #12a9df;\
}\
.ace-white .ace_constant.ace_numeric{\
color: #ef3c97;\
}\
.ace-white .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-white .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-white .ace_support.ace_constant,\
.ace-white .ace_support.ace_function {\
color: #ffa24d\
}\
.ace-white .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-white .ace_storage.ace_type,\
.ace-white .ace_support.ace_class,\
.ace-white .ace_support.ace_type {\
color: #6f9fc5;\
}\
.ace-white .ace_entity.ace_name.ace_function,\
.ace-white .ace_entity.ace_other,\
.ace-white .ace_entity.ace_other.ace_attribute-name,\
.ace-white .ace_variable {\
color: #A6E22E\
}\
.ace-white .ace_variable.ace_parameter {\
color: #FD971F\
}\
.ace-white .ace_string {\
color: #eaa801;;\
}\
.ace-white .ace_comment {\
color: #94a5a6;\
}\
.ace-white .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}\
.ace_gutter-cell {\
	padding-left: 19px;\
}\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #0088ff;\
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
    background: #f6f6f6;\
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
