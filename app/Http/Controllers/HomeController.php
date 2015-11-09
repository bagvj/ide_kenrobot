<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Auth;
use Session;

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
}
