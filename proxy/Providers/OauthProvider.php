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

    $container['token'] = function() use ($container) {
      return function() use ($container) {
        if (!empty($_SESSION['token']['access_token'])) {
          $accessToken = new AccessToken($_SESSION['token']);
          $expires = $accessToken->getExpires();
          if (($expires - $container['settings']['expiresBuffer']) < time()) {
            unset($_SESSION['token']);
            return $container['refreshToken']($accessToken);
          }
          return $accessToken;
        }
        unset($_SESSION['token']);
        return false;
      };
    };

    $container['refreshToken'] = function() use ($container) {
      return function(AccessToken $oldToken) use ($container) {
        $provider = $container['oauth'];
        $accessToken = $provider->getAccessToken('refresh_token', [
          'refresh_token' => $oldToken->getRefreshToken()
        ]);
        if (!empty($accessToken)) {
          $_SESSION['token'] = $accessToken->jsonSerialize();
          return $accessToken;
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
        $container['cache']->set($cacheKey, $accessToken, (int)$accessToken->getExpires()-$container['settings']['expiresBuffer']);
        return $accessToken;
      };
    };
  }
}
