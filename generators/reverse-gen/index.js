"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { resolveNamingData } = require("../../helpers/openApiHelper");
const { loadPreset } = require("../../helpers/loadPreset");
const { filesPrompt } = require("../../helpers/filesPrompt");

class BaseReverseGenerator extends Generator {
  generatorPath(file) {
    return path.join(this.options.target, file);
  }
}

module.exports = class ReverseGenerator extends BaseReverseGenerator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the epic ${chalk.red(
          "generator-ts-from-openapi"
        )} generator!`
      )
    );

    const generatorName = this.fs.readJSON(this.generatorPath("package.json"))
      .name;

    const subGeneratorName = "foo";

    const filestoAdd = await filesPrompt(this)({
      message: "Add a file to reverse engineer ?",
      basePath: this.options.target
    });

    const preset = await loadPreset(this, { basePath: this.options.target });
    const { endpoint } = preset;

    this.data = {
      filestoAdd,
      endpoint,
      generatorName,
      subGeneratorName,
      naming: resolveNamingData(preset)
    };

    this.log("The following data will be used:");
    this.log(this.data);

    const prompts = [
      {
        type: "confirm",
        name: "continue",
        message: "Does this data looks good?",
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      if (!props.continue) {
        throw new Error("Aborted by the user");
      }

      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath("index.js.ejs"),
      this.generatorPath(`generators/${this.data.subGeneratorName}/index.js`)
    );
  }
};
