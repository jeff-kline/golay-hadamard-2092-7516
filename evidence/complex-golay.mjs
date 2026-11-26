import assert from 'node:assert/strict';

// Fourth roots of unity are stored as exponents of i.
function golayCell([a,b],j) {
  const k=a.length-1-j;
  return [[a[j],b[j]],[(2-b[k]+4)%4,(4-a[k])%4]];
}
function binarySelector([x,y],j) {
  const k=x.length-1-j;
  const source=[[x[j],y[j]],[-y[k],x[k]]];
  let active;
  for(let r=0;r<2;r++) for(let c=0;c<2;c++) {
    let value=0;
    for(let u=0;u<2;u++) for(let v=0;v<2;v++)
      value+=(-1)**(r*u+c*v)*source[u][v]/4;
    if(value) {
      assert(!active && Math.abs(value)===1);
      active=[r,c,value===1?0:2];
    }
  }
  assert(active);
  return active;
}
function golayProduct(left,binary,right) {
  const pair=[[],[]];
  for(let j=0;j<left[0].length;j++) for(let k=0;k<binary[0].length;k++) for(let l=0;l<right[0].length;l++) {
    const [r,c,phase]=binarySelector(binary,k);
    for(let col=0;col<2;col++) pair[col].push((golayCell(left,j)[0][r]+phase+golayCell(right,l)[c][col])%4);
  }
  return pair;
}
function verifyPair(pair) {
  const n=pair[0].length;
  for(let lag=0;lag<n;lag++) {
    const counts=[0,0,0,0];
    for(const w of pair) for(let j=0;j<n-lag;j++) counts[(w[j]-w[j+lag]+4)%4]++;
    assert.equal(counts[0]-counts[2],lag===0?2*n:0);
    assert.equal(counts[1]-counts[3],0);
  }
}
function coefficients(pair) {
  const rows=[];
  for(const [index,w] of pair.entries()) for(const sign of [1,-1]) {
    rows.push([1,...w.map(k=>sign*[1,-1,-1,1][k])]);
    rows.push([index===0?0:1,...w.map(k=>sign*[1,1,-1,-1][k])]);
  }
  return rows;
}
// Absolute values 1..8 indicate direct circulants, 11..18 indicate A R,
// and 21..28 indicate transpose(A) R. Reflection here sends j to -j.
const array=[
  [1,2,14,13,16,15,18,17],[-2,1,13,-14,15,-16,17,-18],
  [-14,-13,1,2,-28,27,26,-25],[-13,14,-2,1,27,28,-25,-26],
  [-16,-15,28,-27,1,2,-24,23],[-15,16,-27,-28,-2,1,23,24],
  [-18,-17,-26,25,24,-23,1,2],[-17,18,25,26,-23,-24,-2,1],
];
function entry(rows,i,j) {
  const n=rows[0].length, label=array[Math.floor(i/n)][Math.floor(j/n)];
  const code=Math.abs(label), r=i%n, c=j%n;
  const k=code<10?c-r:code<20?-c-r:c+r;
  return Math.sign(label)*rows[code%10-1][(k+2*n)%n];
}

export function complexGolayWeighing(binary26) {
  const lengthThree = [[0, 0, 2], [0, 1, 0]];
  const pair = golayProduct(lengthThree, binary26, lengthThree);
  assert.equal(pair[0].length, 234);
  verifyPair(pair);
  const words = coefficients(pair);
  const order = 8 * words[0].length;
  return Array.from({ length: order }, (_, row) =>
    Array.from({ length: order }, (_, col) => '-0+'[entry(words, row, col) + 1]).join('')
  );
}
