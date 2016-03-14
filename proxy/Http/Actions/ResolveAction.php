<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

/**
 * Resolve Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class ResolveAction
	extends BaseAction
{
  /**
   * @inheritdoc
   */
  public static function getMethod()
  {
    return 'GET';
  }

  /**
   * @inheritdoc
   */
	public static function getPath()
	{
		return '/resolve';
	}

  /**
   * @inheritdoc
   */
  public static function run($request, $response, $args, $container)
	{
    if (empty($_GET['code'])) {
      return $response->withRedirect('/');
    }
    $provider = $container['oauth'];

    if (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {
      unset($_SESSION['oauth2state']);
      return $c['response']->withStatus(500)
                           ->withHeader('Content-Type', 'text/html')
                            ->write('Invalid oauth state!');
    } else {
      try {
        $accessToken = $provider->getAccessToken('authorization_code', [
            'code' => $_GET['code']
        ]);
        $_SESSION['token'] = $accessToken->jsonSerialize();
        return $container['redirectToIntent']($request, $response, $args);
      } catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
        return $response->withStatus(500)
                             ->withHeader('Content-Type', 'text/html')
                              ->write('Invalid identity provider response! ' . $e->getMessage());
      }
    }
  }
}
