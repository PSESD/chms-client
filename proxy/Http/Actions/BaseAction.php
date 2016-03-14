<?php
/**
 * Clock Hour Management System
 *
 * @copyright Copyright (c) 2016 Puget Sound Educational Service District
 * @license   MIT
 */
namespace CHMS\Client\Http\Actions;

use canis\slim\boot\actions;

/**
 * Action interface
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
abstract class BaseAction
  extends \canis\slim\boot\actions\BaseAction
	implements actions\ActionInterface
{
}
