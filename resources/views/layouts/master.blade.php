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
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/cjxm.css') }} " />
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
         <div class="logo"></div>
         <div class="nav">
           <ul>
             <li><a href="http://mars.kenrobot.com/index.php?app=public&mod=Index&act=allshow">我的主页</a></li>
             <li><a href="http://platform.kenrobot.com/">开发</a></li>
             <li><a href="http://www.kenrobot.com/index.php?app=square&mod=Index&act=listshow">广场</a></li>
             <!--<li><a href=""课程</li>-->
             <li><a href="http://www.kenrobot.com/index.php?app=shop">商城</a></li>
           </ul>
         </div>
         <div class="photo"></div>
         <!--<div class="triangle"></div>-->
         <div class="welcome">
           <span id="platform_name">
             欢迎你，{{ $user->name or '小萝卜'}}
           </span>
         </div>
     </div>
   </div>
   @yield('main')
 </body>
</html>
