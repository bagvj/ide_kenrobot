<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Auth;
use Session;
use ZipArchive;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $user = Auth::user();
    
        return view('index',compact('user'));
    }

    public function initinfo()
    {
        return [
            'uid' => 1,
            'uname' => '萝卜头'
        ];
    }

    public function download(Request $request)
    {
        $time = $request->input('time');
        $projectName = $request->input('proj');
        $path = "/tmp/build$time$projectName.tmp/";
        $srcName = $path."$projectName.cpp";
        $hexName = $path."$projectName.hex";
        // $binName = $path."$projectName.bin";
        // if(!file_exists($srcName) || !file_exists($hexName) || !file_exists($binName)){
        if(!file_exists($srcName) || !file_exists($hexName)){
            //C代码文件或者编译出来的hex文件不存在
            header("content-type=text/html,charset=utf-8");
            die("非法请求");
        }

        //打包
        $zipName = $path."$projectName-".date("YmdHis", $time / 10000).".zip";
        $zip = new ZipArchive();
        if($zip->open($zipName, ZipArchive::CREATE) === TRUE){
            $zip->addFile($srcName, basename(($srcName)));
            $zip->addFile($hexName, basename($hexName));
            // $zip->addFile($hexName, basename($binName));
            $zip->close();
        }

        $filename = $zipName;
        //检查文件是否存在
        if (file_exists($filename)){
            //返回的文件类型
            header("Content-type: application/octet-stream");
            //按照字节大小返回
            header("Accept-Ranges: bytes");
            //返回文件的大小
            header("Accept-Length: ".filesize($filename));
            //这里对客户端的弹出对话框，对应的文件名
            Header("Content-Disposition: attachment; filename=".basename($filename));
            //一次只传输1024个字节的数据给客户端
            //打开文件
            $file = fopen($filename,"r");
            $buffer = 1024;//
            //判断文件是否读完
            while (!feof($file)) {
                //将文件读入内存, 每次向客户端回送1024个字节的数据
                echo fread($file, $buffer);
            }            
            fclose($file);
            
            // $headers = array();
            // $headers['Content-type'] = "application/octet-stream";
            // $headers['Accept-Ranges'] = "bytes";
            // $headers['Accept-Length'] = filesize($filename);
            // $headers['Content-Disposition'] = "attachment; filename=".basename($filename);

            // return response()->download($filename, basename($filename), $headers);
        } else {
            echo "<script>alert('对不起，您要下载的文件不存在！');</script>";
        }
    }

    public function build(Request $request)
    {
        $result = array();
        $code = -1;

        //下载
        $type = 0;
        //直接烧写
        // $type = 1;

        //代码的字节码
        $bytes = $request->input('source');
        //编译类型
        $buildType = $request->input('buildType');
        //项目名字
        $projectName = $request->input('projectName');

        if($bytes)
        {
            $source = $this->fromCharCode($bytes);
            $time = microtime(true) * 10000;
            $path = "/tmp/build$time$projectName.tmp";
            mkdir($path);
            $f = fopen($path."/$projectName.cpp", "wb");
            fwrite($f, $source);
            fclose($f);

            $cmd = "sh ../app/Build/compiler/$buildType/build.sh $projectName $time 2>&1";
            $output = array();
            exec($cmd, $output, $code);
            if($code == 0){
                $result['msg'] = "编译成功";
                if($type == 0){
                    //下载
                    $result['url'] = "/download?proj=$projectName&time=$time";
                } else {
                    //直接烧写
                    $cmd = "sh ../app/Build/flashburn.sh $projectName $time";
                    $output = array();
                    exec($cmd, $output, $code);
                    if($code == 0){
                        $result['msg'] = "烧写成功";
                    } else {
                        $result['msg'] = "烧写失败";
                    }
                }
            } else {
                $result['msg'] = "编译失败";
            }
        } else {
            $result['msg'] = "非法请求";
        }
        $result['code'] = $code;

        // echo json_encode($result, true);
        return collect($result)->toJson();
    }

    private function fromCharCode($codes) {
        if (is_scalar($codes))
            $codes= func_get_args();
        $str= '';
        foreach ($codes as $code)
            $str.= chr($code);
        return $str;
    }
}
