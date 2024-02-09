<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2012 Sebastian Meyer <sebastian.meyer@slub-dresden.de>
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

$EM_CONF[$_EXTKEY] = [
    'title' => 'DFG Viewer - OCR-On-Demand',
    'description' => 'Remote resources navigator for digital libraries. Reads METS/MODS and METS/TEI via OAI-PMH.',
    'category' => 'distribution',
    'author' => 'Christos Sidiropoulos',
    'author_email' => 'christos.sidiropoulos@uni-mannheim.de',
    'author_company' => 'Universitätsbibliothek Mannheim',
    'shy' => '',
    'priority' => '',
    'module' => '',
    'state' => 'dev',
    'internal' => '',
    'uploadfolder' => false,
    'createDirs' => '',
    'modify_tables' => '',
    'clearCacheOnLoad' => false,
    'lockType' => '',
    'version' => '6.0.0-ocr',
    'constraints' => [
        'depends' => [
            'typo3' => '10.4.0-11.3.99',
            'dlf' => '4.0.1-ocr',
        ],
        'conflicts' => [
        ],
        'suggests' => [
        ],
    ],
    '_md5_values_when_last_written' => '',
];
