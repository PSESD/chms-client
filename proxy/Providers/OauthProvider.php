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
class OauthProvider implements ServiceProviderInterface
{
  public function register(Container $container)
  {
    $container['oauth'] = function() use ($container) {
      $provider = new \League\OAuth2\Client\Provider\GenericProvider($container['settings']['oauth']);
      return $provider;
    };

    $container['token'] = function() {
      return function() {
        if (!empty($_SESSION['token']['access_token'])) {
          return new AccessToken($_SESSION['token']);
        }
        return false;
      };
    };

    $container['clientToken'] = function() use ($container) {
      return function() use ($container) {
        $cacheKey = '__clientKey';
        $cache = $container['cache']->get($cacheKey);
        if (!empty($cache)) {
          $accessToken = new AccessToken($cache);
          return $accessToken;
        }
        $provider = $container['oauth'];
        try {
            $accessToken = $provider->getAccessToken('client_credentials');
        } catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
          return false;
        }
        $container['cache']->set($cacheKey, $accessToken, (int)$accessToken->getExpires()-120);
        return $accessToken;
      };
    };
  }
}
