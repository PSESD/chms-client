<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\ResourceServerClients;

/**
 * Hub Client
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class Hub extends BaseClient
{
  public function getProviders()
  {
    $cacheKey = '__providers';
    if (($providers = $this->container['cache']->get($cacheKey))) {
      return $providers;
    }
    $jsonApiClient = $this->container['jsonApiClient']([$this, 'handleClient']);
    $resource = $jsonApiClient->handle('GET', '/providers');
    if (!$resource) {
      return false;
    }
    $providers = [];
    foreach ($resource->all() as $item) {
      $providers[$item['id']] = $item;
    }
    $this->container['cache']->set($cacheKey, $providers, $this->container['settings']['cacheTimes']['providers']);
    return $providers;
  }
}
