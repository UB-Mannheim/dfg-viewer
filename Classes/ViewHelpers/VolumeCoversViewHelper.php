<?php

namespace Slub\Dfgviewer\ViewHelpers;

use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\MathUtility;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Returns the volumes (child documents) of the currently loaded multi-volume
 * work as cover gallery entries (uid, label, thumbnail), split into
 * `volumes` (first `limit` entries) and `more` (remaining entries).
 */
class VolumeCoversViewHelper extends AbstractViewHelper
{
    /**
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('limit', 'int|string', 'Number of volumes to show before the toggle button; falls back to the `volumeCoversLimit` template variable', false);
    }

    /**
     * @return array{volumes: mixed[], more: mixed[], limit: int, hasMore: bool}
     */
    public function render(): array
    {
        $limit = $this->getLimit();

        $parentUid = $this->getCurrentDocumentUid();
        if ($parentUid <= 0) {
            return ['volumes' => [], 'more' => [], 'limit' => $limit, 'hasMore' => false];
        }

        $connection = GeneralUtility::makeInstance(ConnectionPool::class)->getConnectionForTable('tx_dlf_documents');
        $result = $connection->select(
            ['uid', 'title', 'volume', 'mets_label', 'thumbnail'],
            'tx_dlf_documents',
            ['partof' => $parentUid, 'deleted' => 0],
            [],
            [
                'volume_sorting' => 'ASC',
                'mets_orderlabel' => 'ASC',
            ]
        );

        $volumes = [];
        while ($row = $result->fetchAssociative()) {
            $volumes[] = [
                'uid' => (int)$row['uid'],
                'thumbnail' => (string)($row['thumbnail'] ?? ''),
                'label' => $this->buildLabel($row, count($volumes) + 1),
            ];
        }

        return [
            'volumes' => array_slice($volumes, 0, $limit),
            'more' => array_slice($volumes, $limit),
            'limit' => $limit,
            'hasMore' => count($volumes) > $limit,
        ];
    }

    /**
     * Resolve the number of volumes to show: explicit argument,
     * `volumeCoversLimit` template variable or a default of 10.
     *
     * @return int
     */
    private function getLimit(): int
    {
        $candidate = $this->arguments['limit'] ?? null;
        if ($candidate === null) {
            $candidate = $this->renderingContext->getVariableProvider()->get('volumeCoversLimit');
        }

        if (is_int($candidate) || is_string($candidate) && MathUtility::canBeInterpretedAsInteger((string)$candidate)) {
            $limit = max(1, (int)$candidate);
        } else {
            $limit = 10;
        }

        return $limit;
    }

    /**
     * Read the current document uid (`tx_dlf[id]`) from the request.
     *
     * @return int 0 if not found
     */
    private function getCurrentDocumentUid(): int
    {
        $parameters = [];
        $request = $GLOBALS['TYPO3_REQUEST'] ?? null;
        if ($request !== null) {
            $queryParams = $request->getQueryParams();
            $parsedBody = $request->getParsedBody();
            $parameters = array_merge(
                $queryParams['tx_dlf'] ?? [],
                $parsedBody['tx_dlf'] ?? []
            );
        }

        $id = $parameters['id'] ?? null;
        if (is_string($id) && MathUtility::canBeInterpretedAsInteger($id)) {
            return (int)$id;
        }

        return 0;
    }

    /**
     * Build the display label of a volume: title, "Band {volume}", "Band {n}".
     *
     * @param mixed[] $row
     * @param int $index
     *
     * @return string
     */
    private function buildLabel(array $row, int $index): string
    {
        $prefix = '';
        $tsfe = $GLOBALS['TSFE'] ?? null;
        if ($tsfe !== null) {
            try {
                $languageService = GeneralUtility::makeInstance(LanguageServiceFactory::class)->createFromSiteLanguage($tsfe->getLanguageId());
                $prefix = trim((string)$languageService->get('LLL:EXT:dfgviewer/Resources/Private/Language/locallang.xlf:volume.label.prefix'));
            } catch (\Throwable) {
                $prefix = '';
            }
        }
        if ($prefix === '') {
            $prefix = 'Band';
        }

        $title = trim((string)($row['title'] ?? ''));
        if ($title !== '') {
            return $title;
        }
        $volume = trim((string)($row['volume'] ?? ''));
        if ($volume !== '') {
            return $prefix . ' ' . $volume;
        }

        return $prefix . ' ' . $index;
    }
}
