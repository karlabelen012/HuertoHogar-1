function sumar(a, b) {
  return a + b;
}

describe('sumar()', function () {
  it('suma correctamente dos números', function () {
    expect(sumar(2, 3)).toBe(5);
  });
});
