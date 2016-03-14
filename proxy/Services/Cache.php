<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Services;

/**
 * Cache service
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
class Cache
{
  private $predis;

  public function __construct($predis)
  {
    $this->predis = $predis;
  }

  /**
   * Get cache value
   * @param  string $key
   * @return mixed
   */
  public function get($key)
  {
    $result = $this->predis->get($key);
    if (!empty($result)) {
      return json_decode($result, true);
    }
    return null;
  }

  /**
   * Check for key
   * @param  string  $key
   * @return boolean
   */
  public function has($key)
  {
    return $this->predis->exists($key);
  }

  /**
   * Set cached value
   * @param string $key
   * @param mixed $value
   * @param int $expire (optional)
   */
  public function set($key, $value, $expire = null)
  {
    $result = $this->predis->set($key, json_encode($value));
    if ($expire !== null) {
      $result = $result && $this->predis->expireat($key, (int) $expire);
    }
    return $result;
  }
}
