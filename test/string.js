const chai = require('chai');
chai.should();

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const stringUtils = require('../utils/string'); 

describe('string', function() {
    describe('cleanString', function() {
        it ('should clean username strings of problematic characters', function() {
            return fs.readFileAsync(path.join(__dirname, 'data', 'usernameClean.tsv'), 'utf8')
            .then(data => {
                const dataArr = data.split('\n').forEach(row => {
                    const [dirty, clean] = row.split('\t');
                    stringUtils.utf8CleanString(dirty).should.equal(clean);
                });
            });
        });
    });
});