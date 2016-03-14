<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

/**
 * Logout Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class LogoutAction
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
		return '/logout';
	}

  /**
   * @inheritdoc
   */
  public static function run($request, $response, $args, $container)
	{
    unset($_SESSION['oauth2state']);
    unset($_SESSION['token']);
    return $container['redirectToIntent']($request, $response, $args);
  }
}
