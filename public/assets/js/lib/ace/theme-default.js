ace.define("ace/theme/default",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isdefault = true;
exports.cssClass = "ace-default";
exports.cssText = ".ace-default .ace_gutter {\
background: #6B6979;\
color: white\
}\
.ace-default .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-default {\
background-color: #534F59;\
color: #F8F8F2\
}\
.ace-default .ace_cursor {\
color: #F8F8F0\
}\
.ace-default .ace_marker-layer .ace_selection {\
background-color: rgba(255, 211, 197, 0.2)\
}\
.ace-default.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-default .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-default .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-default .ace_marker-layer .ace_active-line {\
background: #3E3D44\
}\
.ace-default .ace_gutter-active-line {\
background-color: transparent;\
}\
.ace-default .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-default .ace_invisible {\
color: #52524d\
}\
.ace-default .ace_entity.ace_name.ace_tag,\
.ace-default .ace_keyword,\
.ace-default .ace_meta.ace_tag,\
.ace-default .ace_storage {\
color: #FF5252\
}\
.ace-default .ace_punctuation,\
.ace-default .ace_punctuation.ace_tag {\
color: #fff\
}\
.ace-default .ace_constant.ace_character,\
.ace-default .ace_constant.ace_language,\
.ace-default .ace_constant.ace_numeric,\
.ace-default .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-default .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-default .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-default .ace_support.ace_constant,\
.ace-default .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-default .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-default .ace_storage.ace_type,\
.ace-default .ace_support.ace_class,\
.ace-default .ace_support.ace_type {\
color: #66D9EF\
}\
.ace-default .ace_entity.ace_name.ace_function,\
.ace-default .ace_entity.ace_other,\
.ace-default .ace_entity.ace_other.ace_attribute-name,\
.ace-default .ace_variable {\
color: #A6E22E\
}\
.ace-default .ace_variable.ace_parameter {\
color: #FD971F\
}\
.ace-default .ace_string {\
color: #E6DB74\
}\
.ace-default .ace_comment {\
color: #827E89\
}\
.ace-default .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}\
.ace_gutter-cell {\
	padding-left: 19px;\
}\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #8B7AA8;\
}\
.ace_editor.ace_autocomplete .ace_line.ace_selected {\
    color: white;\
}\
.ace_editor.ace_autocomplete {\
	border: none;\
}\
.ace_editor.ace_autocomplete .ace_completion-highlight {\
    color: #FFA100;\
    text-shadow: none;\
}\
.ace_editor.ace_autocomplete .ace_line-hover {\
    border: none;\
    margin-top: 0;\
    background: #ECE4F9;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar-track {\
  -webkit-box-shadow: none;\
  background-color: #D3D3D3;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar {\
  background-color: #D3D3D3;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar-thumb {\
  background-color: #998EA2;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar-track {\
  -webkit-box-shadow: none;\
  background-color: #D3D3D3;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar {\
  background-color: #D3D3D3;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar-thumb {\
  background-color: #998EA2;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});