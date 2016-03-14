<?php
/**
 * Web entrypoint
 *
 * @author Jacob Morrison <jmorrison@psesd.org>
 * @since 1.0
 */
require_once(dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php');
if (!class_exists('canis\slim\boot\ApplicationEngine')) {
	throw new \Exception('Requirements have not been installed. Have you ran `composer install`?');
}
canis\slim\boot\ApplicationEngine::run(dirname(__DIR__));
