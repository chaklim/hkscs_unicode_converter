# hkscs_unicode_converter
[![Build Status](https://travis-ci.org/chaklim/hkscs_unicode_converter.svg?branch=master)](https://travis-ci.org/chaklim/hkscs_unicode_converter)

Convert Unicode characters to HKSCS-2016

## Installation

  `npm install @chaklim/hkscs_unicode_converter`

## Usage

    const hkscsConverter = require('@chaklim/hkscs_unicode_converter');

    const str = hkscsConverter.convertCharacter('');
  
  
  Output should be `港`


## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.