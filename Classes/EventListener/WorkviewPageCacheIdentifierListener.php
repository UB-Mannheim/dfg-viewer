<?php

namespace Slub\Dfgviewer\EventListener;

/**
 * Copyright notice
 *
 * (c) Saxon State and University Library Dresden <typo3@slub-dresden.de>
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
 * http://www.gnu.org/copyleft/gpl.html
 *
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * This notice may be incorporated into
 * all copy or derivative works thereof, and must be retained as
 * such.
 */

use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Event\BeforePageCacheIdentifierIsHashedEvent;
use TYPO3\CMS\Frontend\Page\PageInformation;

/**
 * Makes the page cache identifier of the Kitodo workview page specific to
 * the rendered document and page, so that requests with different
 * tx_dlf request parameters (volume, page number, single/double page view,
 * controller/action) get their own cache entries instead of collapsing
 * into a single one.
 *
 * On the workview page all of those variants arrive without a cHash, so
 * without this listener every volume and page of every document would
 * share one page cache entry and the page could not be cached at all
 * without serving stale content of another document.
 */
#[AsEventListener(event: BeforePageCacheIdentifierIsHashedEvent::class)]
class WorkviewPageCacheIdentifierListener
{
    public const EXTENSION_KEY = 'dfgviewer';
    public const EXTENSION_SETTING_WORKVIEW_PAGE_ID = 'workviewPageId';
    public const DEFAULT_WORKVIEW_PAGE_ID = 21;

    public function __invoke(BeforePageCacheIdentifierIsHashedEvent $event): void
    {
        $pageInformation = $event->getRequest()->getAttribute('frontend.page.information');
        if (!$pageInformation instanceof PageInformation) {
            return;
        }

        $workviewPageId = self::getWorkviewPageId();
        if ($pageInformation->getId() !== $workviewPageId) {
            return;
        }

        $txDlfParameters = (array)($event->getRequest()->getQueryParams()['tx_dlf'] ?? []);
        if ($txDlfParameters === []) {
            return;
        }

        $parameters = $event->getPageCacheIdentifierParameters();
        $parameters['dynamicArguments']['tx_dlf'] = $txDlfParameters;
        $event->setPageCacheIdentifierParameters($parameters);
    }

    protected static function getWorkviewPageId(): int
    {
        try {
            $extensionConfiguration = (array)GeneralUtility::makeInstance(ExtensionConfiguration::class)
                ->get(self::EXTENSION_KEY);
        } catch (\Throwable) {
            $extensionConfiguration = [];
        }
        return (int)($extensionConfiguration[self::EXTENSION_SETTING_WORKVIEW_PAGE_ID] ?? self::DEFAULT_WORKVIEW_PAGE_ID);
    }
}
