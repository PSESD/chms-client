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

/**
 * Client generator service
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class ClientGenerator
{
  private $container;

  public function __construct($container)
  {
    $this->container = $container;
  }

  public function getProviderClient($providerId)
  {
    $providers = $this->getHubClient()->getProviders();
    if (!isset($providers[$providerId])) {
      throw new \HttpException\BadRequestException("Provider is unknown");
    }
    $provider = $providers[$providerId];
    $config = [];
    if (isset($this->container['settings']['resourceServers']['_provider'])) {
      $config = $this->container['settings']['resourceServers']['_provider'];
    }
    if (isset($this->container['settings']['resourceServers'][$providerId])) {
      $config = array_merge($config, $this->container['settings']['resourceServers'][$providerId]);
    }
    if (!isset($config['baseUri'])) {
      $config['baseUri'] = $provider['provider_api_url'];
    }
    return new Provider($this->container, $config);
  }

  public function getHubClient()
  {
    if (!isset($this->container['settings']['resourceServers']['hub'])) {
      throw new \Exception("Hub configuration has not been set in settings.resourceServers.hub");
    }
    $config = $this->container['settings']['resourceServers']['hub'];
    return new Hub($this->container, $config);
  }
}
