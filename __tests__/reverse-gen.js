"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-ts-from-openapi:reverse-gen", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/reverse-gen"))
      .withPrompts({ someAnswer: true });
  });

  it("creates files", () => {
    assert.file(["dummyfile.txt"]);
  });
});
