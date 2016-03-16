<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;
use CHMS\Client\Http\Middleware\CleanRequest;
use canis\slim\boot\actions\MiddlewareInterface;
use Slim\Http\Headers;

/**
 * Hub Proxy Action
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
abstract class BaseProxyAction
	extends BaseAction
  implements MiddlewareInterface
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
  public static function run($request, $response, $args, $container)
	{
		$path = $args['uri'];
    $query = $request->getUri()->getQuery();
    if (!empty($query)) {
      $path .= '?' . $query;
    }
		$method = $request->getMethod();
    $client = static::getClient($container, $request, $args);
    $headersRaw = new Headers($request->getHeaders());
    $headers = [];
    foreach ($headersRaw->all() as $key => $value) {
      $headers[$headersRaw->normalizeKey($key)] = $value;
    }
    $body = null;
    if (in_array($method, ['PUT', 'POST', 'PATCH'])) {
      $body = json_encode($request->getParsedBody());
    }
    return $client->handle($method, $path, $headers, $body);
  }

	public static function middleware()
	{
		return [
			CleanRequest::class .':run'
		];
	}

}
