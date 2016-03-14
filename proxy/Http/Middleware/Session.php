<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Middleware;

class Session
{
  private $session;

  public function __construct($container) {
    $this->container = $container;
  }

  /**
   * @inheritdoc
   */
  public function run($request, $response, $next)
  {
    $this->container['session']->register();
    @session_name(env('SESSION_NAME', 'CHMSSES'));
    @session_start();
    $response = $next($request, $response);
    return $response;
  }
}
