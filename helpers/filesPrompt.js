const fs = require("fs/promises");
const path = require("path");
const { Separator } = require("inquirer");

/**
 * @typedef {import('yeoman-generator')} Generator
 */

const helpers = {
  /**
   *
   * @param {Generator} command
   * @returns
   */
  filesPrompt(command) {
    /**
     *
     * @param {Object} options
     * @param {String} options.message    message to show
     * @param {String} options.basePath   base path for the selection
     * @returns {Promise<string[]>}
     */
    return async options => {
      return [await helpers.filePrompt(command)(options)];
    };
  },
  /**
   *
   * @param {Generator} command
   * @returns
   */
  filePrompt(command) {
    /**
     *
     * @param {Object} options
     * @param {String} options.message    message to show
     * @param {String} options.basePath   base path for the selection
     * @param {String} options.curPath    current path for the selection
     * @param {String} options.extraOptions   addifional options that can be selected
     * @returns {Promise<string>}
     */
    return async options => {
      const choice = await helpers.pathPrompt(command)({
        ...options,
        basePath: path.join(options.basePath, options.curPath || ""),
        extraOptions: (options.extraOptions || []).concat(
          options.curPath
            ? {
                name: 'Go up a level',
                value: {
                  isDir: true,
                  base: '..',
                }
              }
            : ""
        )
      });
      if (choice.isDir) {
        return helpers.filePrompt(command)({
          ...options,
          curPath: path.join(options.curPath || "", choice.base)
        });
      }

      if (choice.cb) {
        return choice.cb();
      }

      return choice;
    };
  },
  /**
   *
   * @param {Generator} command
   * @returns
   */
  pathPrompt(command) {
    /**
     *
     * @param {Object} options
     * @param {String} options.message    message to show
     * @param {String} options.basePath   base path for the selection
     * @param {String} options.extraChoices   addifional options that can be selected
     * @returns {Promise<string>}
     */
    return async options => {
      const files = await fs.readdir(options.basePath, { withFileTypes: true });
      const fileOptions = files.map(f => {
        const filePath = path.join(options.basePath, f.name);
        return {
          ...path.parse(filePath),
          path: filePath,
          isDir: f.isDirectory()
        };
      });

      const { choice } = await command.prompt([
        {
          type: "list",
          name: "choice",
          message: options.message,
          choices: (options.extraOptions && options.extraOptions.length
            ? options.extraOptions.concat([new Separator()])
            : []
          ).concat(
            fileOptions.map(f => {
              return {
                name: f.isDir ? `[ ${f.name} ]` : f.name,
                value: f
              };
            }),
            [new Separator()]
          )
        }
      ]);
      return choice;
    };
  }
};
module.exports = helpers;
