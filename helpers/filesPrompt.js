const fs = require("fs/promises");
const path = require("path");
const { Separator } = require("inquirer");

/**
 * @typedef {import('yeoman-generator')} Generator
 */

/**
 * @typedef {object} PathInfo
 * @property {string} path
 * @property {boolean} isDir
 * @property {string} root
 * @property {string} dir
 * @property {string} base
 * @property {string} ext
 * @property {string} name
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
      const endOption = {
        name: "No more file to add",
        value: {
          end: true
        }
      };
      const allOption = {
        name: "Add all files in this directory",
        value: {
          cb: helpers.readDir
        }
      };
      const recurOption = {
        name: "Add recusively all files in this directory",
        value: {
          cb: path => helpers.readDir(path, true)
        }
      };
      const choice = await helpers.filePrompt(command)({
        ...options,
        extraOptions: (options.extraOptions || []).concat([
          endOption,
          allOption,
          recurOption
        ])
      });
      if (choice.base) {
        return [choice].concat(await helpers.filesPrompt(command)(options));
      }

      if (Array.isArray(choice)) {
        return choice.concat(await helpers.filesPrompt(command)(options));
      }

      if (choice.end) {
        return [];
      }

      return [choice];
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
                name: "Go up a level",
                value: {
                  isDir: true,
                  base: ".."
                }
              }
            : []
        )
      });
      if (choice.isDir) {
        return helpers.filePrompt(command)({
          ...options,
          curPath: path.join(options.curPath || "", choice.base)
        });
      }

      if (choice.cb) {
        return choice.cb(options.curPath);
      }

      return choice;
    };
  },

  /**
   *
   * @param {srting} basePath
   * @returns {PathInfo[]}
   */
  async readDir(basePath, recursive = false) {
    const files = await fs.readdir(basePath, {
      withFileTypes: true,
      recursive
    });
    return files.map(f => {
      const filePath = path.join(basePath, f.name);
      return {
        ...path.parse(filePath),
        path: filePath,
        isDir: f.isDirectory()
      };
    });
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

      const choices = (options.extraOptions && options.extraOptions.length
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
      );
      const { choice } = await command.prompt([
        {
          type: "list",
          name: "choice",
          message: options.message,
          choices
        }
      ]);
      return choice;
    };
  }
};
module.exports = helpers;
