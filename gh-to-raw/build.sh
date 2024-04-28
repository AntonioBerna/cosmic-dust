# !/bin/sh

set -xe

cmake -B ./build/
cd ./build/
make
