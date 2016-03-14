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
 * JSON API Resource
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class JsonApiResource
{
  private $client;
  private $resource;
  private $baseRequest;

  public function __construct(JsonApiClient $client, $baseRequest, $resource)
  {
    $this->client = $client;
    $this->baseRequest = $baseRequest;
    $this->resource = $resource;
  }

  public function getResource()
  {
    return $this->resource;
  }

  public function handle($method, $uri, $headers = [], $body = null)
  {
    if (isset($this->baseRequest['headers'])) {
      $headers = array_merge($this->baseRequest['headers'], $headers);
    }
    return $this->client->handle($method, $uri, $headers, $body);
  }

  public function all()
  {
    $resources = [];
    if ($this->resource->has('data')) {
      $data = $this->resource->get('data');
      foreach ($data->asArray() as $item) {
        $resources[] = array_merge(['id' => $item->get('id')], $item->get('attributes')->asArray());
      }
    }
    if ( $this->resource->has('meta')) {
      $meta = $this->resource->get('meta');
      if ($meta->has('pagination')) {
        $pagination = $meta->get('pagination');
        if (isset($pagination->links) && isset($pagination->links->next)) {
          $nextResult = $this->handle('GET', $pagination->links->next);
          if ($nextResult) {
            $resources = array_merge($resources, $nextResult->all());
          }
        }
      }
    }
    return $resources;
  }
}
