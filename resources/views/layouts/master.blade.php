<!DOCTYPE HTML>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="user-scalable=no">
  <title>啃萝卜智能硬件平台</title>
  <meta name="description" content="啃萝卜智能硬件平台" />
  <meta name="keywords" content="啃萝卜智能硬件平台" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />

  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/base.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/index.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/yjlj.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/hardware.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/rjbc.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/software.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/scroll.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/jquery.contextMenu.css') }} " />
  <link href="{{ asset('assets/img/favicon.ico') }}" type="image/x-icon" rel="shortcut icon" />
  <script data-main="assets/js/main" src=" {{ asset('assets/js/lib/require.min.js')}}" type="text/javascript"></script>


 </head>
 <body>

   <div class="header">
     <div class="content">
         <span><a href="http://www.kenrobot.com/index.php?app=square&mod=Index&act=index" class="logo"></a></span>
         <div class="nav">
           <ul>
             <li><a href="http://www.kenrobot.com/index.php?app=public&mod=Index&act=allshow">我的主页</a></li>
             <li><a href="http://platform.kenrobot.com/" class="on">开发</a></li>
             <li><a href="http://www.kenrobot.com/index.php?app=square&mod=Index&act=listshow">广场</a></li>
             <li><a href="http://www.kenrobot.com/index.php?app=shop">商城</a></li>
           </ul>
         </div>
        <div class="person-wrap">
          <div class="person">
            <a href="#" class="photo">
              <img src="{{ $user->avatar_url or asset('assets/img/photo.png') }}" />
            </a>
            <i class="iconfont icon-dot">&#xe600;</i>
            <span class="welcome">
              Hi,{{ $user->name or '萝卜头'}}
            </span>
          </div>
        </div>
   
        <div class="search">
          <form method="post" action="#">
            {{ csrf_field() }}
            <input class="search_input" id="search_input" type="text" placeholder="搜索" autocomplete="off" name="search_input"></input>
            <i class="iconfont icon-search">&#xe665;</i>
          </form>
        </div>
     </div>
   </div>
   @yield('main')
 </body>
</html>
