<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

/**
 * Login Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class LoginAction
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
		return '/login';
	}

  /**
   * @inheritdoc
   */
  public static function run($request, $response, $args, $container)
	{
    if (isset($_SESSION['token'])) {
      return $container['redirectToIntent']($request, $response, $args);
    }
    $provider = $container['oauth'];
    $authorizationUrl = $provider->getAuthorizationUrl();
    $_SESSION['oauth2state'] = $provider->getState();
    return $response->withRedirect($authorizationUrl);
  }
}
