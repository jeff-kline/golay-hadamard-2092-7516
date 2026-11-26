# Verification of the Golay constructions

The general binary transfer is the previously released theorem. The paper proves the complex Golay specialization, instantiates both constructions at known orders, and supplies exact matrices. The determinant obstruction applies to the indicated paired arrays under independent changes of signed bases. Equivalence to earlier Hadamard matrices remains open.

## Reproduction

From the repository root run `make verify` and `make paper`. The first command generates four weighing matrices, checks their complete Grams, constructs four packed Hadamard matrices, and calls a separate row-distance verifier. The [script](verify.sh) compares the four SHA-256 digests and reports the output directory. [Build instructions and field parameters](README.md)

| Order | Unordered distinct row pairs | Distance in every pair |
|---:|---:|---:|
| 2092 | 2,187,186 | 1046 |
| 2572 | 3,306,306 | 1286 |
| 4204 | 8,834,706 | 2102 |
| 7516 | 28,241,370 | 3758 |

All 42,569,568 row pairs passed. The three-page paper was built with pdfTeX 1.40.22 (TeX Live 2021), using the fixed epoch in the Makefile. The PDF of the revised manuscript has SHA-256 `456d6c48bcfe741cf4480081b22c85acaac090050f3beac8ea68e63e4e94da9e`. The release check used Node.js 24.22.3 and Apple clang 21.0.0.

## Review and attribution

Two process-separated AI reviewers examined the submitted paper, its credited sources and the construction code on November 26, 2026. These reviews are internal research checks. The mathematical reviewer reproduced the four full Gram checks, verified primitivity of the four field generators, and independently extracted the four determinant rectangles from the ternary matrices. The source reviewer checked the signed layout against all 64 blocks of the printed array. Cyclic reversal in the generator is shifted by one position from the printed back diagonal and satisfies the same transpose identity for circulants. [Eight-circulant array, Lemma 2](https://www3.stat.sinica.edu.tw/ss_newpaper/SS-2024-0379_na.pdf#page=18)

The manuscript now credits both earlier conference-based constructions of 7516. It also specifies the second-word reversal of the length-10 binary seed used for the exact witnesses at 2572 and 4204. The three rendered pages were inspected, and the four witness digests matched their recorded values. [Earlier 7516 constructions](https://doi.org/10.5281/zenodo.24549453) · [Golay seed reference](https://doi.org/10.1002/jcd.20222)

The earlier constructions at 2092 are credited to Kumar and Cooley. The comparison with the 29 sporadic orders refers to Table 4 and Section 4 of the November 3 survey. On November 26 the GitHub code query `"7516" "Golay" Hadamard` and repository query `Hadamard Golay 2092` returned no results. The claim concerns four explicit constructions at known orders. Historical priority for the alternative proofs is unclaimed. [Survey](https://arxiv.org/html/2610.27175v2#S4) · [Kumar’s construction chronology](https://generalised.si/research/hadamard-matrices)
