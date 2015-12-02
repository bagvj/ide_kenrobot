@extends('layouts.master')

@section('main')
  <link rel="stylesheet" type="text/css" href="{{ asset('assets/highlight/styles/solarized_light.css') }}" />

 <div class="header no-select">
    <div class="content">
      <span><a href="{{$nav['self'] or '#'}}" class="logo"></a></span>
      <div class="nav">
        <ul>
          <li><a href="{{$nav['mainpage'] or '#'}}">我的主页</a></li>
          <li><a href="{{$nav['develop'] or '#'}}" class="on">开发</a></li>
          <li><a href="{{$nav['square'] or '#'}}">广场</a></li>
          <li><a href="{{$nav['market'] or '#'}}">商城</a></li>
        </ul>
      </div>

      <div class="login">
        <ul>
          @if(isset($user))
          <li><a href="/auth/logout" class="logoutBtn">退出</a></li>
          @else
          <li><a href="{{ $nav['register'] or '#'}}">注册</a></li>
          <li><a href="javascript:;" class="loginBtn">登录</a></li>
          @endif
        </ul>
      </div>

      @if(isset($user))
      <div class="person-wrap">
        <div class="person">
            <a href="{{$nav['mainpage'] or '#'}}" class="photo">
                <img src="{{ $user->avatar_url or asset('assets/img/photo.png') }}" />
            </a>
            <span class="welcome">Hi,{{$user->name}}</span>
        </div>
      </div>
      @endif
    </div>
  </div>

<div class="main">
    <div class="mod no-select">
        <div class="nav-second">
            <ul></ul>
        </div>
        <div class="canvas" id="hardware-container"></div>
    </div>
    <div class="mod no-select">
        <div class="nav-second">
            <ul>
                <li class="ypzmk active">
                    <div class="category">已配置模块<div class="arrow"></div></div>
                    <div class="content-container flowchart_hardware_part_list">
                        <ul></ul>
                    </div>
                </li>
                <li class="lckzmk1">
                    <div class="category">流程控制模块<div class="arrow"></div></div>
                    <ul>
                        <div class="content-container">
                            <li>
                                <div id="flowchart_tjfz" data-item="flowchart_tjfz_item" class="flowchart-item flowchart-tjfz"></div>条件分支
                            </li>
                            <li>
                                <div id="flowchart_tjxh" data-item="flowchart_tjxh_item" class="flowchart-item flowchart-tjxh"></div>条件循环
                            </li>
                            <li>
                                <div id="flowchart_yyxh" data-item="flowchart_yyxh_item" class="flowchart-item flowchart-yyxh"></div>永远循环
                            </li>
                            <li>
                                <div id="flowchart_jsxh" data-item="flowchart_jsxh_item"class="flowchart-item flowchart-jsxh"></div>计数循环
                            </li>
                            <li>
                                <div id="flowchart_fh" data-item="flowchart_fh_item" class="flowchart-item flowchart-fh"></div>返回
                            </li>
                        </div>
                    </ul>
                </li>
                <li class="lckzmk2">
                    <div class="category">函数控制模块<div class="arrow"></div></div>
                    <ul>
                        <div class="content-container">
                            <li>
                                <div id="flowchart_yshs" data-item="flowchart_yshs_item" class="flowchart-item flowchart-yshs"></div>延时函数
                            </li>
                            <li>
                                <div id="flowchart_dshs" data-item="flowchart_dshs_item" class="flowchart-item flowchart-dshs"></div>定时函数
                            </li>
                            <li>
                                <div id="flowchart_fzhs" data-item="flowchart_fzhs_item" class="flowchart-item flowchart-fzhs"></div>赋值函数
                            </li>
                            <li>
                                <div id="flowchart_sjhs" data-item="flowchart_sjhs_item" class="flowchart-item flowchart-sjhs"></div>随机函数
                            </li>
                            <li>
                                <div id="flowchart_zdyhs" data-item="flowchart_zdyhs_item" class="flowchart-item flowchart-zdyhs"></div>自定义函数
                            </li>
                        </div>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="canvas" id="flowchart-container"></div>
    </div>
    <div class="side">
        <div class="trolley-side no-select">
            <div class="bar">已配置模块<div class="car"></div></div>
            <div class="list hardware_part_list">
                <ul></ul>
            </div>
            <div class="buy" onclick="window.open('http://www.kenrobot.com/index.php?app=shop');">元件选购</div>
        </div>
        <div class="var-side no-select">
            <div class="bar">变量</div>
            <div class="content">
                <table id="var-table">
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>种类</th>
                            <th>类型</th>
                            <th>初值</th>
                            <th>描述</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="operator">
                <div class="btn add">增加</div>
                <div class="btn del">删除</div>
                <div class="btn modify">修改</div>
            </div>
        </div>
        <div class="code-side">
            <div class="bar no-select">源代码</div>
            <div class="content">
                <div class="code-wrap">
<pre><code id="c_code_input" class="c_code_area"></code></pre>
                </div>
            </div>
            <div class="code_view"></div>
        </div>
    </div>
    <div class="tabs no-select">
        <ul>
            <li><span>硬件连接</span></li>
            <li><span>软件编程</span></li>
        </ul>
    </div>
    <div class="thumbnail no-select">
        <div class="canvas-wrap" data-action="show">
            <div class="canvas" id="thumbnailCanvas"></div>
        </div>
        <div class="foldBtn active"></div>
    </div>
    <div class="mod_btn no-select">
        <!-- <div class="save">保存</div> -->
        <div class="download">下载</div>
    </div>
    <div id="code-more" style="display:none">
    <div class="closeBtn"></div>
    <div class="code-wrap">
<pre><code class="code"></code></pre>
    </div>
    </div>
</div>
@stop
