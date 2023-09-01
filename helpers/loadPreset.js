const { cosmiconfig } = require("cosmiconfig");
const SwaggerParser = require("swagger-parser");
const fs = require("fs/promises");
const path = require("path");
/**
 * @typedef {import('yeoman-generator')} Generator
 */

const helpers = {
  /**
   *
   * @param {Generator} command
   * @param {Object} options
   * @param {String} options.basePath    path containing the preset folder
   * @returns
   */
  async loadPreset(command, options) {
    const opt = {
      basePath: path.join(path.dirname(command.resolved), "..", ".."),
      ...options
    };
    const configPath = path.join(opt.basePath, "presets");
    console.log("Main:", configPath);
    const files = await fs.readdir(configPath, { withFileTypes: true });
    // Console.log(files);
    const presetsFiles = files
      .filter(f => !f.isDirectory() && f.name[0] !== ".")
      .map(f => path.parse(path.join(configPath, f.name)));
    // Console.log(presetsFiles);

    const { presetsFile } = await command.prompt([
      {
        type: "list",
        name: "presetsFile",
        message: "use a preset ?",
        choices: presetsFiles.map(f => {
          return {
            name: f.name,
            value: f
          };
        })
      }
    ]);
    // Console.log(presetsFile);

    const parsedConfing = await cosmiconfig(presetsFile.name).load(
      path.join(presetsFile.dir, presetsFile.base)
    );
    console.log(parsedConfing);
    const config = parsedConfing.config;
    const api = await SwaggerParser.dereference(
      path.join(configPath, config.apiDocFile)
    );
    const endpoint = api.paths[config.path][config.method];
    return {
      config,
      configName: presetsFile.name,
      endpoint
    };
  }
};
module.exports = helpers;
