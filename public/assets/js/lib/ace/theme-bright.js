ace.define("ace/theme/bright",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isbright = true;
exports.cssClass = "ace-bright";
exports.cssText = ".ace-bright .ace_gutter {\
background: #e8e9e9;\
color: #515151\
}\
.ace-bright .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-bright {\
background-color: #f5f4f1;\
color: #515151\
}\
.ace-bright .ace_cursor {\
color: #F8F8F0\
}\
.ace-bright .ace_marker-layer .ace_selection {\
background-color: rgba(255, 211, 197, 0.2)\
}\
.ace-bright.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #534F59;\
}\
.ace-bright .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-bright .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-bright .ace_marker-layer .ace_active-line {\
background: #a1b1c4\
}\
.ace-bright .ace_gutter-active-line {\
background-color: transparent;\
}\
.ace-bright .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-bright .ace_invisible {\
color: #52524d\
}\
.ace-bright .ace_entity.ace_name.ace_tag,\
.ace-bright .ace_keyword,\
.ace-bright .ace_meta.ace_tag,\
.ace-bright .ace_storage {\
color: #FF5252\
}\
.ace-bright .ace_punctuation,\
.ace-bright .ace_punctuation.ace_tag {\
color: #fff\
}\
.ace-bright .ace_constant.ace_character,\
.ace-bright .ace_constant.ace_language,\
.ace-bright .ace_constant.ace_numeric,\
.ace-bright .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-bright .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-bright .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-bright .ace_support.ace_constant,\
.ace-bright .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-bright .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-bright .ace_storage.ace_type,\
.ace-bright .ace_support.ace_class,\
.ace-bright .ace_support.ace_type {\
color: #0d69dd\
}\
.ace-bright .ace_entity.ace_name.ace_function,\
.ace-bright .ace_entity.ace_other,\
.ace-bright .ace_entity.ace_other.ace_attribute-name,\
.ace-bright .ace_variable {\
color: #A6E22E\
}\
.ace-bright .ace_variable.ace_parameter {\
color: #FD971F\
}\
.ace-bright .ace_string {\
color: #E6DB74\
}\
.ace-bright .ace_comment {\
color: #ababab\
}\
.ace-bright .ace_identifier {\
color: #78c50f\
}\
.ace-bright .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}\
.ace_gutter-cell {\
	padding-left: 19px;\
}\
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\
    background-color: #5592df;\
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
    background: #e8edf3;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar-track {\
  -webkit-box-shadow: none;\
  background-color: #e4e9ef;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar {\
  background-color: #e4e9ef;\
}\
.ace_scrollbar.ace_scrollbar-v::-webkit-scrollbar-thumb {\
  background-color: #bac9d9;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar-track {\
  -webkit-box-shadow: none;\
  background-color: #e4e9ef;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar {\
  background-color: #e4e9ef;\
}\
.ace_scrollbar.ace_scrollbar-h::-webkit-scrollbar-thumb {\
  background-color: #bac9d9;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
