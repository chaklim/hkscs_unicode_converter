'use strict';

const fs = require('fs');
const isHexadecimal = require('is-hexadecimal');

let unicodeMapping = {};

const files = [
  {
    name: 'gccs',
    type: 'tsv',
    header: [ 'Big5', 'Unicode', 'Big5Alternate', 'UnicodeName' ],
    config: {
      columnFromKeys: ['Big5Alternate'],
      columnKeyTo: 'Unicode',
    },
  },
  {
    name: 'hkscs1999',
    type: 'tsv',
    header: [ 'Big5', 'Unicode', 'UnicodeAlternate', 'UnicodeName' ],
    config: {
      columnFromKeys: ['UnicodeAlternate'],
      columnKeyTo: 'Unicode',
    },
  },
  {
    name: 'hkscs2001',
    type: 'tsv',
    header: [ 'Big5', 'Unicode', 'UnicodeAlternate', 'UnicodeName' ],
    config: {
      columnFromKeys: ['UnicodeAlternate'],
      columnKeyTo: 'Unicode',
    },
  },
  {
    name: 'hkscs2001_2',
    type: 'tsv',
    header: [
      'BIG-5',
      'ISO/IEC_10646-1:1993',
      'ISO/IEC_10646-1:2000',
      'ISO/IEC_10646-2:2001',
    ],
    config: {
      columnFromKeys: ['ISO/IEC_10646-1:1993', 'ISO/IEC_10646-1:2000'],
      columnKeyTo: 'ISO/IEC_10646-2:2001',
    }
  },
  {
    name: 'hkscs2004',
    type: 'tsv',
    header:  [
      'BIG-5',
      'ISO/IEC_10646-1:1993',
      'ISO/IEC_10646-1:2000',
      'ISO/IEC_10646:2003_Amendment',
    ],
    config: {
      columnFromKeys: ['ISO/IEC_10646-1:1993', 'ISO/IEC_10646-1:2000'],
      columnKeyTo: 'ISO/IEC_10646:2003_Amendment',
    },
  },
  {
    name: 'hkscs2008',
    type: 'tsv',
    header:  [
      'BIG-5',
      'ISO/IEC_10646-1:1993',
      'ISO/IEC_10646-1:2000',
      'ISO/IEC_10646:2003_Amendment',
    ],
    config: {
      columnFromKeys: ['ISO/IEC_10646-1:1993', 'ISO/IEC_10646-1:2000'],
      columnKeyTo: 'ISO/IEC_10646:2003_Amendment',
    },
  },
  {
    name: 'hkscs2016',
    type: 'json',
    config: {
      columnFromKeys: ['codepoint'],
      columnKeyTo: 'char',
    },
  },
];

const tsvFile2json = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  const rows = content.split('\n');

  const header = rows[0].split('\t');
  const contentRows = rows.slice(1);

  let json = [];
  contentRows.forEach(row => {
    const columns = row.split('\t');
    let data = {};
    columns.forEach((column, index) => {
      data[header[index]] = column;
    });

    json.push(data);
  });

  return json;
}

const jsonFile2json = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  const json = JSON.parse(content);
  return json;
}

const getFilePath = (fromFile) => {
  return `${__dirname}/hkscs/${fromFile}`;
};

files.forEach(file => {
  const filePath = getFilePath(`${file.name}.${file.type}`);

  if (filePath.endsWith('.tsv')) {
    unicodeMapping[file.name] = {
      array: tsvFile2json(filePath)
    };
  }
  if (filePath.endsWith('.json')) {
    unicodeMapping[file.name] = {
      array: jsonFile2json(filePath)
    };
  }
});

const formattedKeyValuePairFrom = (key, value) => {
  if (
    typeof key !== 'string' || key.length <= 0 ||
    typeof value !== 'string' || value.length <= 0 ||
    key === value
  ) {
    return {};
  }

  const isRemoveFirstTwoCharacters = key.startsWith('U+');
  const newKey = isRemoveFirstTwoCharacters ? key.substr(2) : key;
  const newValue = isRemoveFirstTwoCharacters ? value.substr(2) : value;

  // handle  Ê̄, Ê̌, ê̄, ê̌ (<00CA,0304>, <00CA,030C>, <00EA,0304>, <00EA,030C>)
  if (newValue.startsWith('<') && newValue.endsWith('>')) {
    const parsedValue = String.fromCodePoint.apply(
      null,
      value.slice(1, -1).split(',').map(stringValue => parseInt(stringValue, 16))
    );
    return {
      key: newKey,
      value: parsedValue
    };
  }

  return {
    key: newKey,
    value: newValue,
  }
}

const mappingFrom = ({
  unicodeMappingArray,
  columnFromKeys,
  columnKeyTo,
}) => {
  const mapping = {};

  unicodeMappingArray.forEach(data => {
    columnFromKeys.forEach(columnKeyFrom => {
      const { key, value } = formattedKeyValuePairFrom(data[columnKeyFrom], data[columnKeyTo]);
      if (!!key && !!value) {
        mapping[key] = value;
      }
    });
  });

  return mapping;
};

// create mapping
files.forEach(file => {
  const unicodeMappingArray = unicodeMapping[file.name].array;
  const { columnFromKeys, columnKeyTo } = file.config;

  unicodeMapping[file.name].map = mappingFrom({
    unicodeMappingArray,
    columnFromKeys,
    columnKeyTo,
  });
});

// - unicode to char
// 0. gccs Big5Alternate to Unicode
// 1. hkscs1999 UnicodeAlternate to Unicode
// 2. hkscs2001 UnicodeAlternate to Unicode
// 3. hkscs2004 'ISO/IEC_10646-1:1993'/'ISO/IEC_10646-1:2000' to 'ISO/IEC_10646:2003_Amendment'
// 4. hkscs2008 'ISO/IEC_10646-1:1993'/'ISO/IEC_10646-1:2000' to 'ISO/IEC_10646:2003_Amendment'
// 5. hkscs2016 codepoint to char

const mappings = Object.keys(unicodeMapping).map(key => unicodeMapping[key].map);

// char is a string character
const convertCharacter = (char) => {
  if (typeof char !== 'string') {
    return char;
  }
  const charLength = Array.from(char).length;
  if (charLength <= 0 || charLength > 1) {
    return char;
  }

  let charKey = char.codePointAt(0).toString(16).toUpperCase();

  let newChar = mappings.reduce((value, mapping) => {
    return mapping[value] || value;
  }, charKey);

  if (typeof newChar === 'string' && Array.from(newChar).length === 1) {
    return newChar;
  }
  if (isHexadecimal(newChar)) {
    return String.fromCodePoint(parseInt(newChar, 16));
  }
  return newChar;
};

const convertString = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  return Array.from(str).map(char => convertCharacter(char)).join('')
};

module.exports = Object.freeze({
  convertCharacter,
  convertString
});
