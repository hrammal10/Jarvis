import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { generateSize, getGifPath } from '../src/utils/helpers';

test('generateSize returns a value in the supported range', () => {
    for (let index = 0; index < 100; index += 1) {
        const result = generateSize();
        const match = /^8(={1,20})D$/.exec(result.size);

        assert.ok(match);
        assert.ok(result.rating.length > 0);
    }
});

test('getGifPath resolves assets from the project', () => {
    const gifPath = getGifPath('processing');

    assert.equal(path.basename(gifPath), 'processing.gif');
    assert.equal(path.basename(path.dirname(gifPath)), 'gifs');
    assert.ok(existsSync(gifPath));
});
