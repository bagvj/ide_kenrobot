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
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/scroll.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/jquery-ui.min.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/jquery.contextMenu.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/index.css') }} " />
  <link href="{{ asset('assets/img/favicon.ico') }}" type="image/x-icon" rel="shortcut icon" />
  <script data-main="assets/js/main" src=" {{ asset('assets/js/lib/require.min.js')}}" type="text/javascript"></script>

 </head>
 <body>
 
   @yield('main')
  <div id="login_dialog" style="display:none"></div>
 </body>
</html>
