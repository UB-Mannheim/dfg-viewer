<?php

namespace Slub\Dfgviewer\Tests\Unit\EventListener;

/**
 * Copyright notice
 *
 * (c) University Library Mannheim <bib@uni-mannheim.de>
 * All rights reserved
 *
 * This script is part of the TYPO3 project. The TYPO3 project is
 * free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 */

use PHPUnit\Framework\TestCase;
use Slub\Dfgviewer\EventListener\WorkviewPageCacheIdentifierListener;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Frontend\Event\BeforePageCacheIdentifierIsHashedEvent;
use TYPO3\CMS\Frontend\Page\PageInformation;

class WorkviewPageCacheIdentifierListenerTest extends TestCase
{
    /**
     * @var WorkviewPageCacheIdentifierListener
     */
    protected WorkviewPageCacheIdentifierListener $subject;

    /**
     * @var array<string, mixed>|null
     */
    protected ?array $extensionConfigurationStorage = null;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new WorkviewPageCacheIdentifierListener();
        $this->extensionConfigurationStorage = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS'] ?? null;
        $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['dfgviewer'] = ['workviewPageId' => 21];
    }

    protected function tearDown(): void
    {
        if ($this->extensionConfigurationStorage === null) {
            unset($GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']);
        } else {
            $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS'] = $this->extensionConfigurationStorage;
        }
        parent::tearDown();
    }

    /**
     * @param array<string, mixed> $queryParameters
     */
    protected function buildRequest(int $pageId, array $queryParameters = []): ServerRequest
    {
        $pageInformation = new PageInformation();
        $pageInformation->setId($pageId);
        return (new ServerRequest('http://test.example.com/werksansicht'))
            ->withQueryParams($queryParameters)
            ->withAttribute('frontend.page.information', $pageInformation);
    }

    public function testIgnoresRequestsOfOtherPages(): void
    {
        $event = new BeforePageCacheIdentifierIsHashedEvent(
            $this->buildRequest(4711, ['tx_dlf' => ['id' => '1', 'page' => '1']]),
            ['id' => 4711]
        );

        ($this->subject)($event);

        self::assertSame(['id' => 4711], $event->getPageCacheIdentifierParameters());
    }

    public function testAddsTxDlfParametersToIdentifierParametersForWorkviewPage(): void
    {
        $txDlfParameters = ['id' => '56141', 'page' => '102', 'double' => '0'];
        $event = new BeforePageCacheIdentifierIsHashedEvent(
            $this->buildRequest(21, ['tx_dlf' => $txDlfParameters]),
            ['id' => 21]
        );

        ($this->subject)($event);

        $parameters = $event->getPageCacheIdentifierParameters();
        self::assertArrayHasKey('dynamicArguments', $parameters);
        self::assertSame($txDlfParameters, $parameters['dynamicArguments']['tx_dlf']);
    }

    public function testIgnoresWorkviewPageWithoutTxDlfParams(): void
    {
        $event = new BeforePageCacheIdentifierIsHashedEvent(
            $this->buildRequest(21),
            ['id' => 21]
        );

        ($this->subject)($event);

        self::assertSame(['id' => 21], $event->getPageCacheIdentifierParameters());
    }

    public function testIgnoresRequestsWithoutPageInformation(): void
    {
        $request = (new ServerRequest('http://test.example.com/'))
            ->withQueryParams(['tx_dlf' => ['id' => '1']]);
        $event = new BeforePageCacheIdentifierIsHashedEvent($request, ['id' => 1]);

        ($this->subject)($event);

        self::assertSame(['id' => 1], $event->getPageCacheIdentifierParameters());
    }

    public function testUsesConfiguredWorkviewPageIdFromExtensionConfiguration(): void
    {
        $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['dfgviewer'] = ['workviewPageId' => 77];

        $event = new BeforePageCacheIdentifierIsHashedEvent(
            $this->buildRequest(77, ['tx_dlf' => ['id' => '1']]),
            ['id' => 77]
        );
        ($this->subject)($event);

        self::assertSame(['id' => '1'], $event->getPageCacheIdentifierParameters()['dynamicArguments']['tx_dlf']);

        $eventForOtherPage = new BeforePageCacheIdentifierIsHashedEvent(
            $this->buildRequest(21, ['tx_dlf' => ['id' => '1']]),
            ['id' => 21]
        );
        ($this->subject)($eventForOtherPage);

        self::assertSame(['id' => 21], $eventForOtherPage->getPageCacheIdentifierParameters());
    }
}
