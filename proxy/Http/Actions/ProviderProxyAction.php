<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

/**
 * Provider Proxy Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class ProviderProxyAction
	extends BaseProxyAction
{
  /**
   * @inheritdoc
   */
  public static function getMethod()
  {
    return '*';
  }

  /**
   * @inheritdoc
   */
	public static function getPath()
	{
		return '/api/provider/{provider}{uri:.*}';
	}

	public static function getClient($container, $request, $args)
  {
    return $container['clients']->getProviderClient($args['provider']);
  }
}
