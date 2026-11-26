# Golay constructions of Hadamard matrices of orders 2092 and 7516

Jeffery Kline

**Release candidate v0.1.0.** [Admission record](ADMISSION.md)

We give Golay constructions for real Hadamard matrices at two known orders, 2092 and 7516. Both constructions start with short pairs of sequences and use them to build a weighing matrix with exactly two zeros in each row. An earlier theorem turns that weighing matrix into a Hadamard matrix. The same theorem gives two companion orders, 2572 and 4204. [Read the paper](paper/main.pdf) · [LaTeX source](paper/main.tex) · [Weighing-matrix transfer theorem](https://doi.org/10.5281/zenodo.24519197)

## What is new

**Order 2092.** Kumar and Cooley each constructed a matrix of this order in October 2026. The November survey lists 2092 among the 29 orders outside its construction families. Starting with two one-entry sequences, seven Golay doublings give a pair of length 128. We append a fixed three-entry tail to each word, once with a plus sign and once with a minus sign. The four resulting words give a weighing matrix of order 524 and weight 522. The transfer at the prime 521 then gives order 2092. This supplies the input sequences without a search. [Kumar’s chronology](https://generalised.si/research/hadamard-matrices) · [Survey, Section 4](https://arxiv.org/html/2610.27175v2#S4)

**Order 7516.** Both earlier constructions used a symmetric conference matrix of order 118. One combined it with Yamada’s circulants at 233, the other with quaternion blocks from the Paley matrix at 467. Here two copies of a complex Golay pair of length 3 and a binary pair of length 26 give a complex pair of length 234. We pad the pair and form four complex words. Their real and imaginary parts supply eight circulants for a weighing matrix of order 1880 and weight 1878. This gives order 7516 at the prime 1877. More generally, a complex Golay pair of length $g$ gives Hadamard order $32g+28$ whenever $8g+5$ is prime. [Earlier constructions](https://doi.org/10.5281/zenodo.24549453) · [Complex Golay generator](evidence/complex-golay.mjs)

In all four examples the positions of the zeros determine how to pair the rows and columns. Each full two-by-two block then represents a rotation or a reflection after compression. Four block determinants have product $-1$, so every choice of signed bases within those pairs leaves at least one reflection.

## Rebuild and verify the four matrices

From this directory, with Node.js and a C++17 compiler, run

```sh
sh verify.sh
```

The script prints the directory containing the four packed matrices. To choose where it creates that directory, run `sh verify.sh ./results`.

The generator checks the Golay correlations at every aperiodic lag and the four block determinants reported for each order. In the binary cases it also checks the four padded words. The builder checks the full Gram matrix of the weighing matrix, constructs the Yamada sequences over a quadratic extension of the prime field, and writes the Hadamard matrix. A separate verifier reads the packed output and checks its size, its padding and the Hamming distance between every pair of distinct rows. In each case the distance is half the order, so the rows are orthogonal. The script also checks the SHA-256 digest of each output. [Golay generator](evidence/golay.mjs) · [Matrix builder](evidence/build.cpp) · [Row-distance verifier](evidence/verify.cpp)

| Hadamard order | Field prime | Radicand | Distinct row pairs | Common distance |
|---:|---:|---:|---:|---:|
| 2092 | 521 | 19 | 2,187,186 | 1046 |
| 2572 | 641 | 19 | 3,306,306 | 1286 |
| 4204 | 1049 | 28 | 8,834,706 | 2102 |
| 7516 | 1877 | 3 | 28,241,370 | 3758 |

For each radicand $d$ in the table, the builder uses the field element $4+w$, where $w^2=d$. For orders 2572 and 4204 the generator reverses the second word of the published length-10 seed before doubling or multiplication. The C++ builder and verifier come from the earlier order-7516 release, with updated defaults and usage messages. [C++ source revision](https://github.com/jeff-kline/hadamard-orders-7516-14556-16012/tree/56e6b0131cd7f6985ac8f36846ccc283dc34f18d/evidence) · [Jedwab and Parker on the binary seeds](https://doi.org/10.1002/jcd.20222)

**Packed format.** Each file is named for its order, for example `H2092.packed`. Each row starts on a byte boundary. Bits run from most to least significant, with 1 denoting a minus sign and 0 a plus sign. Four zero padding bits end each row.

## Typeset the note

```sh
make paper
```

[Verification and review](VERIFICATION.md) · [Citation](CITATION.cff) · [Correction policy](CORRECTIONS.md) · [License](LICENSE)
