import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { complexGolayWeighing } from './complex-golay.mjs';

// Jedwab and Parker (2009), binary Golay pairs of lengths 10 and 26.
const decode = s => Array.from(s, ch => ch === '+' ? 1 : -1);
const seed = new Map([
  [10, ['++-+-+--++', '++-+++++--'].map(decode)],
  [26, ['++++-++--+-+-+--+-+++--+++', '++++-++--+-+++++-+---++---'].map(decode)],
]);
const examples = new Map([
  [2092, { factors: [2, 2, 2, 2, 2, 2, 2], d: 3 }],
  [2572, { factors: [10, 2, 2, 2, 2], d: 1 }],
  [4204, { factors: [10, 26], d: 3 }],
]);

function doubled([a, b]) {
  return [a.concat(b), a.concat(b.map(x => -x))];
}

function product([a, b], [c, d]) {
  const left = [], right = [];
  for (let i = 0; i < a.length; ++i) {
    const same = (a[i] + b[i]) / 2, different = (a[i] - b[i]) / 2;
    for (let j = 0; j < c.length; ++j) {
      const k = c.length - 1 - j;
      left.push(same * c[j] + different * d[j]);
      right.push(same * d[k] - different * c[k]);
    }
  }
  return [left, right];
}

function verifyNorm(words, weight) {
  const length = words[0].length;
  for (let h = 0; h < length; ++h) {
    let total = 0;
    for (const word of words) {
      assert.equal(word.length, length);
      for (let i = h; i < length; ++i) total += word[i] * word[i - h];
    }
    assert.equal(total, h === 0 ? weight : 0);
  }
}

function weighing(order, { factors, d }) {
  let pair = [[1], [1]];
  for (const f of factors) pair = f === 2 ? doubled(pair) : product(pair, seed.get(f));
  const [a, b] = pair, g = a.length, length = g + d;
  verifyNorm(pair, 2 * g);
  const [u, v] = d === 1 ? [[1], [0]] : [[1, 1, -1], [1, 0, 1]];
  const words = [a.concat(u), a.concat(u.map(x => -x)), b.concat(v), b.concat(v.map(x => -x))];
  verifyNorm(words, 4 * length - 2);
  assert.equal(16 * length - 4, order);
  const codes = [[1,2,3,4], [-2,1,-4,3], [-3,4,1,-2], [-4,-3,2,1]];
  const rows = [];
  for (let r = 0; r < 4 * length; ++r) {
    const bi = Math.floor(r / length), i = r % length;
    let line = '';
    for (let c = 0; c < 4 * length; ++c) {
      const bj = Math.floor(c / length), j = c % length, code = codes[bi][bj];
      const shift = bi === bj ? j - i : bi * bj === 0 ? -i - j : i + j;
      const entry = Math.sign(code) * words[Math.abs(code) - 1][(shift + 2 * length) % length];
      line += '-0+'[entry + 1];
    }
    rows.push(line);
  }
  return rows;
}

// Block rows are ordered by the first occurrence of their pair of zero columns.
// In a four-cycle, every row/column basis change contributes its determinant twice.
function verifyReflectionCycle(rows, lastColumn, expectedSigns) {
  const groups = new Map();
  rows.forEach((line, r) => {
    const a = line.indexOf('0'), b = line.indexOf('0', a + 1);
    assert(a >= 0 && b > a && line.indexOf('0', b + 1) < 0);
    if (!groups.has(a)) groups.set(a, { rows: [], cols: [a, b] });
    assert.equal(groups.get(a).cols[1], b);
    groups.get(a).rows.push(r);
  });
  const paired = Array.from(groups.values());
  assert(paired.every(g => g.rows.length === 2));
  function determinant(i, j) {
    const [a, b] = paired[i].rows, [c, d] = paired[j].cols;
    const value = (r, k) => ({ '+': 1, '-': -1 })[rows[r][k]];
    // det(F/2) = -1/2 for the binary Hadamard block F.
    return (value(a,d)*value(b,c) - value(a,c)*value(b,d)) / 2;
  }
  const signs = [determinant(0,2), determinant(1,2), determinant(1,lastColumn), determinant(0,lastColumn)];
  assert.deepEqual(signs, expectedSigns);
  assert.equal(signs.reduce((a,b) => a*b, 1), -1);
  console.log('Determinants around the four-cycle:', signs.join(', '));
}

const order = Number(process.argv[2]);
const certificates = new Map([
  [2092, [66, [1,-1,-1,-1]]],
  [2572, [5, [-1,-1,-1,1]]],
  [4204, [3, [1,-1,1,1]]],
  [7516, [3, [1,-1,1,1]]],
]);
assert(certificates.has(order) && process.argv.length === 4, 'usage: node golay.mjs 2092|2572|4204|7516 weighing.txt');
const rows = order === 7516 ? complexGolayWeighing(seed.get(26)) : weighing(order, examples.get(order));
verifyReflectionCycle(rows, ...certificates.get(order));
writeFileSync(process.argv[3], rows.join('\n') + '\n');
