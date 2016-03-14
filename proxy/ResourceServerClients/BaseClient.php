<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\ResourceServerClients;

use GuzzleHttp\Client as GuzzleClient;
use HttpException\ForbiddenException;
/**
 * Client
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
abstract class BaseClient
{
  protected $container;
  protected $getToken;
  protected $getClientToken;
  protected $config;
  private $oauth;
  private $client;

  public function __construct($container, $config = [])
  {
    $this->container = $container;
    $this->oauth = $container['oauth'];
    $this->getToken = $container['token'];
    $this->getClientToken = $container['clientToken'];
    $this->setConfig($config);
  }

  public function handle($method, $uri, $headers = [], $body = null, $throwException = true)
  {
    $token = call_user_func($this->getToken);
    if (!$token) {
      if ($throwException) {
        throw new ForbiddenException();
      }
      return false;
    }
    return $this->internalHandle($token, $method, $uri, $headers, $body);
  }

  public function handleClient($method, $uri, $headers = [], $body = null, $throwException = true)
  {
    $token = call_user_func($this->getClientToken);
    if (!$token) {
      if ($throwException) {
        throw new ForbiddenException();
      }
      return false;
    }
    return $this->internalHandle($token, $method, $uri, $headers, $body, false);
  }

  protected function internalHandle($token, $method, $uri, $headers = [], $body = null)
  {
    $clientOptions = [];
    $clientOptions['headers'] = $this->getHeaders();
    if ($body !== null) {
      $clientOptions['body'] = $body;
    }
    $request = $this->getOauth()->getAuthenticatedRequest($method, $uri, $token, $clientOptions);
    try {
      $response = $this->getClient()->send($request);
    } catch (\Exception $e) {
      throw new \HttpException\GatewayTimeoutException("Remote API is not available");
    }
    $response = $response->withoutHeader('Server');
    return $response;
  }

  public function getHeaders($headers = [])
  {
    if (!empty($this->config['clientId'])) {
      $headers['x-client'] = $this->config['clientId'];
    }
    if (!empty($this->config['clientSecret'])) {
      $headers['x-client-signature'] = sha1($this->config['clientSecret']);
    }
    $_this = $this;
    $headers = array_filter($headers, function($k) use ($_this) {
      return in_array($k, $_this->getOkayHeaders());
    }, ARRAY_FILTER_USE_KEY);
    return $headers;
  }

  public function getOkayHeaders()
  {
    return ['x-client', 'x-client-signature', 'x-real-ip', 'content-type', 'accept'];
  }

  public function getOauth()
  {
    return $this->oauth;
  }

  public function getConfig()
  {
    return $this->config;
  }

  public function setConfig($config)
  {
    $this->checkConfig($config);
    $this->config = $config;
  }

  protected function requiredConfig()
  {
    return ['baseUri'];
  }

  private function checkConfig($config)
  {
    foreach ($this->requiredConfig() as $key) {
      if (!isset($config[$key])) {
        throw new \Exception("Invalid resource server client. Missing config: {$key}");
      }
    }
  }

  protected function getClient()
  {
    if (!isset($this->client)) {
      $this->client = new GuzzleClient([
          'base_uri' => $this->config['baseUri'],
          'timeout'  => 5,
          'http_errors' => false,
          'connect_timeout' => 15
      ]);
    }
    return $this->client;
  }
}
