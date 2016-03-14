<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Providers;

use Pimple\ServiceProviderInterface;
use Pimple\Container;
use CHMS\Client\Http\Middleware\Session;
use canis\slim\boot\ApplicationEngine as App;
use League\OAuth2\Client\Token\AccessToken;

/**
 * Application service provider
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class AppProvider implements ServiceProviderInterface
{
  public function register(Container $container)
  {
    $app = App::instance();
    $app->add(Session::class .':run');
    $container['session'] = function() use ($container) {
      return new \Predis\Session\Handler($container['redis']);
    };
    $container['redirectToIntent'] = function() {
      return function ($request, $response, $args) {
          return $response->withRedirect('/');
      };
    };

    $container['redis'] = function() {
      $config = [
          'scheme' => 'tcp',
          'host'   => env('REDIS_HOST', '127.0.0.1'),
          'port'   => env('REDIS_PORT', '6379'),
      ];
      if (($password = env('REDIS_PASSWORD', false))) {
        $config['password'] = $password;
      }
      if (($database = env('REDIS_DATABASE', false))) {
        $config['database'] = $database;
      }
      return new \Predis\Client($config);
    };

  }
}
