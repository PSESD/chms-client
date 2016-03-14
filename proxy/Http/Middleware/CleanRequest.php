<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Middleware;

use HttpException\BadRequestException;

class CleanRequest
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
    // Must use request body (JSON API); Protects against CSRF attack
    if (!empty($_POST)) {
      throw new BadRequestException();
    }

    // Must be a common verb
    if (!in_array($request->getMethod(), ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'])) {
      throw new BadRequestException();
    }

    // No body on GET, HEAD, DELETE, or OPTIONS
    $content = $request->getBody()->getContents();
    if (in_array($request->getMethod(), ['GET', 'HEAD', 'DELETE', 'OPTIONS']) && !empty($content)) {
      throw new BadRequestException();
    }

    return $next($request, $response);
  }
}
