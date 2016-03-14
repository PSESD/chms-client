<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

use canis\slim\boot\actions\MiddlewareInterface;
use CHMS\Client\Http\Middleware\Auth;

/**
 * Client Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class ClientAction
	extends BaseAction
	implements MiddlewareInterface
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
		return '/';
	}

  /**
   * @inheritdoc
   */
  public static function run($request, $response, $args, $container)
	{
    $body = $response->getBody();
    $body->write(file_get_contents(APP_BASE_PATH . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'client.html'));
  }

	public static function middleware()
	{
		return [
			Auth::class .':run'
		];
	}
}
