ace.define("ace/theme/dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-dark";
exports.cssText = ".ace-dark .ace_gutter {\
background: #6B6979;\
color: white\
}\
.ace-dark .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-dark {\
background-color: #534F59;\
color: #F8F8F2\
}\
.ace-dark .ace_cursor {\
color: #F8F8F0\
}\
.ace-dark .ace_marker-layer .ace_selection {\
background-color: rgba(255, 211, 197, 0.2)\
}\
.ace-dark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-dark .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-dark .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-dark .ace_marker-layer .ace_active-line {\
background: #3E3D44\
}\
.ace-dark .ace_gutter-active-line {\
background-color: transparent;\
}\
.ace-dark .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-dark .ace_invisible {\
color: #52524d\
}\
.ace-dark .ace_entity.ace_name.ace_tag,\
.ace-dark .ace_keyword,\
.ace-dark .ace_meta.ace_tag,\
.ace-dark .ace_storage {\
color: #FF5252\
}\
.ace-dark .ace_punctuation,\
.ace-dark .ace_punctuation.ace_tag {\
color: #fff\
}\
.ace-dark .ace_constant.ace_character,\
.ace-dark .ace_constant.ace_language,\
.ace-dark .ace_constant.ace_numeric,\
.ace-dark .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-dark .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-dark .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-dark .ace_support.ace_constant,\
.ace-dark .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-dark .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-dark .ace_storage.ace_type,\
.ace-dark .ace_support.ace_class,\
.ace-dark .ace_support.ace_type {\
color: #66D9EF\
}\
.ace-dark .ace_entity.ace_name.ace_function,\
.ace-dark .ace_entity.ace_other,\
.ace-dark .ace_entity.ace_other.ace_attribute-name,\
.ace-dark .ace_variable {\
color: #A6E22E\
}\
.ace-dark .ace_variable.ace_parameter {\
color: #FD971F\
}\
.ace-dark .ace_string {\
color: #E6DB74\
}\
.ace-dark .ace_comment {\
color: #827E89\
}\
.ace-dark .ace_indent-guide {\
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
