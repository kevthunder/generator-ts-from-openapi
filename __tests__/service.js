"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-ts-from-openapi:service", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/service"))
      .withPrompts({ someAnswer: true });
  });

  it("creates files", () => {
    assert.file(["dummyfile.txt"]);
  });
});
