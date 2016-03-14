<?php
// Rollbar::init([
// 	'access_token' => env('ROLLBAR_ACCESS_TOKEN', false),
//     'environment' => APP_ENV,
//     'root' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'proxy'
// ]);


return [
  'bootstrap' => [
    CHMS\Client\Http\Routes::class,
    CHMS\Client\Providers\AppProvider::class,
    CHMS\Client\Providers\OauthProvider::class
  ],
  'settings' => [

  ]
];
