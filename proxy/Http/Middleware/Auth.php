<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Middleware;

class Auth
{
  private $container;

  public function __construct($container) {
    $this->container = $container;
  }

  /**
   * @inheritdoc
   */
  public function run($request, $response, $next)
  {
    $token = $this->container['token']();
    if (!$token) {
      return $response->withRedirect('/login');
    }
    return $next($request, $response);
  }
}
