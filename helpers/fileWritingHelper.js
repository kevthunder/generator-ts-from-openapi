const ejs = require("ejs");
/**
 * @typedef {import('yeoman-generator')} Generator
 */

const helpers = {
  appendPositionFinder(content) {
    return content.length;
  },
  /**
   *
   * @param {Generator} command
   * @returns
   */
  insertTpl(command) {
    return (
      template,
      target,
      data,
      positionFinder = helpers.appendPositionFinder
    ) => {
      const targetExists = command.fs.exists(target);
      if (targetExists) {
        const tpl = command.fs.read(template);
        const newContent = ejs.render(tpl, { ...data, targetExists });
        const currentContent = command.fs.read(template);
        const pos = positionFinder(currentContent);
        const mergedContent =
          currentContent.substring(0, pos) +
          newContent +
          currentContent.substring(pos);
        command.fs.write(target, mergedContent);
      } else {
        command.fs.copyTpl(template, target, { ...data, targetExists });
      }
    };
  },
  /**
   *
   * @param {Generator} command
   * @returns
   */
  appendTpl(command) {
    return (template, target, data) => {
      const targetExists = command.fs.exists(target);
      if (targetExists) {
        const tpl = command.fs.read(template);
        const newContent = ejs.render(tpl, { ...data, targetExists });
        command.fs.append(target, newContent);
      } else {
        command.fs.copyTpl(template, target, { ...data, targetExists });
      }
    };
  }
};
module.exports = helpers;
