#!/bin/sh
set -eu

# With an argument, retain the packed matrices in the caller's chosen directory.
# Each invocation gets a private subdirectory, including concurrent runs.
parent=${1:-${TMPDIR:-/tmp}}
mkdir -p "$parent"
out=$(mktemp -d "$parent/golay-hadamard.XXXXXX")
src=$(CDPATH= cd "$(dirname "$0")/evidence" && pwd)
verify_order() {
    order=$1
    q=$2
    radicand=$3
    expected=$4
    node "$src/golay.mjs" "$order" "$out/W$order.txt"
    "${CXX:-c++}" -O3 -std=c++17 -DTRANSFER_PRIME="$q" -DFIELD_RADICAND="$radicand" "$src/build.cpp" -o "$out/build$order"
    "$out/build$order" "$out/W$order.txt" "$out/H$order.packed"
    "${CXX:-c++}" -O3 -std=c++17 -DHADAMARD_ORDER="$order" "$src/verify.cpp" -o "$out/verify$order"
    "$out/verify$order" "$out/H$order.packed"
    node -e '
      const fs = require("node:fs"), crypto = require("node:crypto");
      const [path, expected] = process.argv.slice(1);
      const actual = crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
      if (actual !== expected) throw Error("SHA-256 mismatch for " + path);
      console.log("SHA-256 matched " + actual);
    ' "$out/H$order.packed" "$expected"
}

verify_order 2092 521 19 a6aa8db990ab09ec2937c148cb9e515575dec8bd0cf1b140e6624ea7637b68e5
verify_order 2572 641 19 c7c2f3cb6b6442ebde3f1f7e90c40ce5d600c3c606392cfac5a2e35da069e2ab
verify_order 4204 1049 28 c94ce8756b8ca96dd819e0b7324e11483261e09d3e18b55b7b2abcec7581fb02
verify_order 7516 1877 3 88c37c074a4e7b4b9c7628c2e89b5b47606763bd2448707c8e8fde11dba02ba3
echo "Matrices and verification programs in $out"
