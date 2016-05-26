<?php
// Rollbar::init([
// 	'access_token' => env('ROLLBAR_ACCESS_TOKEN', false),
//     'environment' => APP_ENV,
//     'root' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'proxy'
// ]);


$config = [
  'bootstrap' => [
    CHMS\Client\Http\Routes::class,
    CHMS\Client\Providers\AppProvider::class,
    CHMS\Client\Providers\OauthProvider::class
  ],
  'settings' => [
    'expiresBuffer' => env('API_TOKEN_EXPIRES_BUFFER', 30),
    'cacheTimes' => [
      'providers' => env('CACHE_TIME_PROVIDERS', 60),
      'routes' => env('CACHE_TIME_ROUTES', 60)
    ]
  ]
];
$config['settings']['oauth'] = [
  'clientId'                => env('API_CLIENT_ID'),
  'clientSecret'            => env('API_CLIENT_SECRET'),
  'redirectUri'             => env('CLIENT_URL') . '/resolve',
  'urlAuthorize'            => env('AUTH_AUTHORIZE_URL'),
  'urlRegister'            => env('AUTH_REGISTER_URL'),
  'urlAccessToken'          => env('AUTH_ACCESS_TOKEN_URL'),
  'urlResourceOwnerDetails' => ''
];
$config['settings']['resourceServers'] = [];
$config['settings']['resourceServers']['_provider'] = [
  'clientId'                => env('API_CLIENT_ID')
];
$config['settings']['resourceServers']['hub'] = [
  'clientId'                => env('API_CLIENT_ID'),
  'clientSecret'            => env('API_CLIENT_SECRET'),
  'baseUri'                 => env('API_HUB_URL')
];
return $config;
