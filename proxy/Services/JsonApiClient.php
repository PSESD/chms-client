<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Services;
use CHMS\Client\ResourceServerClients\Hub;
use CHMS\Client\ResourceServerClients\Provider;
use Art4\JsonApiClient\Utils\Manager;
/**
 * JSON API Client
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class JsonApiClient
{
  public function __construct(callable $requestHandler)
  {
    $this->handler = $requestHandler;
  }

  public function handle($method, $uri, $headers = [], $body = null)
  {
    $response = call_user_func_array($this->handler, [$method, $uri, $headers, $body, false]);
    if (!$response || $response->getStatusCode() !== 200) {
      return false;
    }
    $manager = new Manager();
    try {
      $resource = $manager->parse($response->getbody()->getContents());
    } catch (\Exception $e) {
      return false;
    }
    $baseRequest = ['headers' => $headers];
    return new JsonApiResource($this, $baseRequest, $resource);
  }
}
