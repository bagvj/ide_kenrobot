<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\User As UserModel;
use App\WebAuth\SnsAuth;
use Curl\Curl;
class SyncSnsUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:snsuser';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '批量同步SNS用户数据';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        $snsauth = new SnsAuth();
        $userlist = UserModel::all();
        $userlist = $userlist->toArray();
        $total = count($userlist);
        $this->output->progressStart($total);

        foreach ($userlist as $u) {
            if (empty($u['uid'])) {
                $this->info($u['name']);
                $user = UserModel::find($u['id']);
                $user->uid = $this->fetchUidFromSns($u['email']);
                $user->save();
            }
            $this->output->progressAdvance();
        }

        $this->output->progressFinish();
        //
    }

    /**
     * 从SNS中取回用户uid
     */
    protected function fetchUidFromSns($email)
    {
        $curl = new Curl();
        $url = "http://www.kenrobot.com/?app=api&mod=UserCenter&act=fetch_uid&email=".$email;
        $data = $curl->get($url);

        if (is_string($data)) {
            $userData = json_decode($data, true);
        } else {
            $userData = (array) $data;
        }
        if ($userData['code'] == 0) {
            return intval($userData['data']['uid']);
        }
        return 0;
    }

   


}
