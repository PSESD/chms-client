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
use CHMS\Client\Services\Cache;
use CHMS\Client\Services\JsonApiClient;
use CHMS\Client\Services\ClientGenerator;
use canis\slim\boot\ApplicationEngine as App;
use League\OAuth2\Client\Token\AccessToken;
use HttpException\Exception as HttpException;

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
    $container['originalErrorHandler'] = $container->raw('errorHandler');
    $container['errorHandler'] = function ($container) {
      return function ($request, $response, $exception) use ($container) {
        $responseCode = 500;
        if ($exception instanceof HttpException) {
          $responseCode = $exception->getCode();
        }
        $response = $container['response']->withStatus($responseCode);
        $headers = $request->getHeaders();
        $acceptType = null;
        if (isset($headers['HTTP_ACCEPT'][0])) {
          $acceptType = $headers['HTTP_ACCEPT'][0];
        }
        switch ($acceptType) {
          case 'application/json':
          case 'application/vnd.api+json':
            $body = json_encode(['error' => $exception->getMessage()]);
          break;
          default:
            return $container['originalErrorHandler']($request, $response, $exception);
          break;
        }
        return $response->withHeader('Content-Type', 'text/html')
                        ->write($body);
      };
    };

    $container['cache'] = function() use ($container) {
      return new Cache($container['redis']);
    };

    $container['clients'] = function() use ($container) {
      return new ClientGenerator($container);
    };

    $container['jsonApiClient'] = function() {
      return function(callable $handler) {
        return new JsonApiClient($handler);
      };
    };

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
