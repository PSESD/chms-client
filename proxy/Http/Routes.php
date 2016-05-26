<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http;

use canis\slim\boot\actions\Map as ActionMap;

/**
 * Route action map for the API
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class Routes extends ActionMap
{
  public static function actions()
	{
		return [
      Actions\LoginAction::class,
      Actions\RegisterAction::class,
      Actions\LogoutAction::class,
      Actions\ResolveAction::class,
      Actions\HubProxyAction::class,
      Actions\ProviderProxyAction::class,
      Actions\HomeAction::class,
      Actions\ClientAction::class,
    ];
  }
}
