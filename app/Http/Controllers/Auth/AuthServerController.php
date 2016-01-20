<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use App\User;
use Auth;

class AuthServerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json(['code' => 0, 'message' => '已经登录', 'user' => $user]);
        }
        return response()->json(['code' => -1, 'message' => '未登录']);
    }
}