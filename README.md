# hkscs_unicode_converter
[![Build Status](https://travis-ci.org/chaklim/hkscs_unicode_converter.svg?branch=master)](https://travis-ci.org/chaklim/hkscs_unicode_converter)

Convert Unicode characters to HKSCS-2016

## Installation

  `npm install hkscs_unicode_converter`

## Usage

    const hkscsConverter = require('hkscs_unicode_converter');

    const str = hkscsConverter.convertCharacter('');
    const str2 = hkscsConverter.convertString('香');


  Output should be `港` and `香港`


## Tests

  `npm test` or `yarn test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
