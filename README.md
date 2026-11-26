# Golay constructions of Hadamard matrices of orders 2092 and 7516

Jeffery Kline

**Release candidate v0.1.0.** [Admission record](ADMISSION.md)

Seven doublings of the length-one Golay pair, a three-entry extension and the weighing-matrix transfer give a real Hadamard matrix of order 2092. At order 7516 a complex Golay pair of length 234 gives an eight-circulant weighing matrix with two zeros per row. The same transfer constructs orders 2572 and 4204 from fixed binary pairs. The note gives a four-block certificate for the occurrence of reflections in each paired array. [Read the paper](paper/main.pdf) · [LaTeX source](paper/main.tex) · [Predecessor paper, version 0.1.0](https://doi.org/10.5281/zenodo.24519197)

## What is new

Kumar and Cooley had already constructed order 2092 in October 2026. The November survey lists it among its 29 sporadic orders. This paper identifies 2092 as a specialization of the predecessor paper’s Golay corollary and constructs the matrix without a word search. [Kumar’s chronology](https://generalised.si/research/hadamard-matrices) · [Survey, Section 4](https://arxiv.org/html/2610.27175v2#S4)

Both previously released constructions of order 7516 used a symmetric conference matrix of order 118, with Yamada circulants at 233 or quaternion blocks from Paley at 467. Here a product of pairs of lengths 3, 26 and 3 supplies all eight circulants. In the resulting $W(1880,1878)$, the zeros identify the row and column pairs, and the nonzero tiles give the conference entries. The finite-field step takes $q=1877$. [Earlier construction](https://doi.org/10.5281/zenodo.24549453) · [Complex Golay generator](evidence/complex-golay.mjs)

## Rebuild and verify the four matrices

From this directory, with Node.js and a C++17 compiler, run

```sh
sh verify.sh
```

The script prints the output directory. To retain the results in a chosen location, supply a parent directory, for example `sh verify.sh ./results`. Each run creates a new subdirectory. The files named `H2092.packed`, `H2572.packed`, `H4204.packed` and `H7516.packed` contain the matrices as signs packed one row at a time, most significant bit first, with 1 denoting a minus sign and four zero padding bits at the end of each row.

The generator checks every aperiodic lag of the resulting Golay pair at each order. It checks the four padded words in the binary cases and uses the eight-circulant array in the complex case. All four examples are checked against the block determinants printed in the paper. The builder checks the whole weighing Gram, forms the Yamada sequences over a quadratic extension of the prime field, and writes the sign matrix. The separate verifier reads only that packed matrix and checks its size, padding and every pair of rows. The script also compares each file with its expected SHA-256 digest. [Golay generator](evidence/golay.mjs) · [Builder](evidence/build.cpp) · [Row-distance verifier](evidence/verify.cpp)

| Hadamard order | Field prime | Radicand | Distinct row pairs | Common distance |
|---:|---:|---:|---:|---:|
| 2092 | 521 | 19 | 2,187,186 | 1046 |
| 2572 | 641 | 19 | 3,306,306 | 1286 |
| 4204 | 1049 | 28 | 8,834,706 | 2102 |
| 7516 | 1877 | 3 | 28,241,370 | 3758 |

For radicand $d$, the field builder uses $4+w$ with $w^2=d$. These implementations of the transfer and verifier are from the author's order-7516 release, with the defaults and usage messages adjusted for this paper. The generator lists the binary seeds of lengths 10 and 26. For the 2572 and 4204 witnesses it reverses the second word of the length-10 seed before doubling or multiplication. [Source revision for the two C++ programs](https://github.com/jeff-kline/hadamard-orders-7516-14556-16012/tree/56e6b0131cd7f6985ac8f36846ccc283dc34f18d/evidence) · [Jedwab and Parker on the seeds](https://doi.org/10.1002/jcd.20222)

## Typeset the note

```sh
make paper
```

[Verification and review](VERIFICATION.md) · [Citation](CITATION.cff) · [Correction policy](CORRECTIONS.md) · [License](LICENSE)
