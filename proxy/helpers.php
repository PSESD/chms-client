<?php

if (!function_exists('env')) {
  function env($variable, $default = null)) {
    if (($env = getenv($variable))) {
      return $env;
    }
    if (isset($_GLOBALS[$variable])) {
      return $_GLOBALS[$variable];
    }
    return $default;
  }
}
