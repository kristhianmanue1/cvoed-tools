describe("Example Test Suite", () => {
  test("true is true", () => {
    expect(true).toBe(true);
  });

  test("localStorage mock works", () => {
    localStorage.setItem("test", "value");
    expect(localStorage.getItem("test")).toBe("value");
  });
});
