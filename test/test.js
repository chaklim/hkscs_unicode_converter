'use strict';

const expect = require('chai').expect;
const converter = require('../index');

describe('convertCharacter', function() {
  const { convertCharacter } = converter;

  it('should convert nothing to undefined', function() {
    const result = convertCharacter();
    expect(result).to.equal(undefined);
  });

  it('should convert undefined to undefined', function() {
    const result = convertCharacter(undefined);
    expect(result).to.equal(undefined);
  });

  it('should not convert \'\'', function() {
    const result = convertCharacter('');
    expect(result).to.equal('');
  });

  it('should not convert 👍', function() {
    const result = convertCharacter('👍');
    expect(result).to.equal('👍');
  });

  it('should not convert 👋🏿', function() {
    const result = convertCharacter('👋🏿');
    expect(result).to.equal('👋🏿');
  });

  it('should convert  to 卿', function() {
    const result = convertCharacter('');
    expect(result).to.equal('卿');
  });

  it('should convert  to 瑜', function() {
    const result = convertCharacter('');
    expect(result).to.equal('瑜');
  });

  it('should convert  to 港', function() {
    const result = convertCharacter('');
    expect(result).to.equal('港');
  });
  
  it('should not convert string with length > 1 (i.e. return original input)', function() {
    const result = convertCharacter('ABC');
    expect(result).to.equal('ABC');
  });

  it('should convert U+F325 to \'Ê̄\' (<00CA,0304>)', function() {
    const result = convertCharacter(String.fromCodePoint(0xf325));
    expect(result).to.equal('Ê̄');
  });

  it('should convert U+2A3ED to 㴝', function() {
    const result = convertCharacter(String.fromCodePoint(0x2A3ED));
    expect(result).to.equal('㴝');
  });

  it('should not convert 我', function() {
    const result = convertCharacter('我');
    expect(result).to.equal('我');
  });

  it('should not convert 我們', function() {
    const result = convertCharacter('我們');
    expect(result).to.equal('我們');
  });
});

describe('convertString', function() {
  const { convertString } = converter;

  it('should convert nothing to undefined', function() {
    const result = convertString();
    expect(result).to.equal(undefined);
  });

  it('should convert undefined to undefined', function() {
    const result = convertString(undefined);
    expect(result).to.equal(undefined);
  });

  it('should not convert \'\'', function() {
    const result = convertString('');
    expect(result).to.equal('');
  });

  it('should not convert 👍', function() {
    const result = convertString('👍');
    expect(result).to.equal('👍');
  });

  it('should not convert 🦉👋🏿', function() {
    const result = convertString('🦉👋🏿');
    expect(result).to.equal('🦉👋🏿');
  });

  it('should convert  to 卿', function() {
    const result = convertString('');
    expect(result).to.equal('卿');
  });

  it('should convert  to 瑜', function() {
    const result = convertString('');
    expect(result).to.equal('瑜');
  });

  it('should convert  to 港', function() {
    const result = convertString('');
    expect(result).to.equal('港');
  });
  
  it('should convert U+F325 to \'Ê̄\' (<00CA,0304>)', function() {
    const result = convertString(String.fromCodePoint(0xf325));
    expect(result).to.equal('Ê̄');
  });

  it('should convert U+2A3ED to 㴝', function() {
    const result = convertString(String.fromCodePoint(0x2A3ED));
    expect(result).to.equal('㴝');
  });

  it('should convert , to 𥄫,𨋢', function() {
    const result = convertString(',')
    expect(result).to.equal('𥄫,𨋢');
  });

  it('should not convert ABC', function() {
    const result = convertString('ABC')
    expect(result).to.equal('ABC');
  });

  it('should not convert 我', function() {
    const result = convertString('我');
    expect(result).to.equal('我');
  });

  it('should not convert 我們', function() {
    const result = convertString('我們');
    expect(result).to.equal('我們');
  });

  it('should convert 壞 to 壞𨋢', function() {
    const result = convertString('壞');
    expect(result).to.equal('壞𨋢');
  });
});
