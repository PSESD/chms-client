<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

/**
 * Hub Proxy Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class HubProxyAction
	extends BaseProxyAction
{
  /**
   * @inheritdoc
   */
	public static function getPath()
	{
		return '/api/hub{uri:.*}';
	}


  public static function getClient($container, $request, $args)
  {
    return $container['clients']->getHubClient();
  }
}
