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
	extends BaseAction
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
		return '/api/hub{uri:.*}';
	}

  /**
   * @inheritdoc
   */
  public static function run($request, $response, $args, $container)
	{
    var_dump($request);exit;
  }
}
