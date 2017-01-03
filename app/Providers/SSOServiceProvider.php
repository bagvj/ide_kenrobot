<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\WebAuth\ApiProxy;
use App\WebAuth\Broker;

class SSOServiceProvider extends ServiceProvider
{
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(['App\\WebAuth\\ApiProxy' => 'kenrobot.apiproxy'], function ($app) {
            $appId = config('kenrobot.api.appId');
            $appSecret = config('kenrobot.api.appSecret');
            $baseUrl = config('kenrobot.api.baseUrl');

            return new ApiProxy($appId, $appSecret, $baseUrl);

        });

        $this->app->singleton(['App\\WebAuth\\Broker' => 'kenrobot.ssobroker'], function($app) {
            $brokerId = config('kenrobot.sso.brokerId');
            $brokerSecret = config('kenrobot.sso.brokerSecret');
            $baseUrl = config('kenrobot.sso.baseUrl');

            return new Broker($brokerId, $brokerSecret, $baseUrl);
        });
    }
}
