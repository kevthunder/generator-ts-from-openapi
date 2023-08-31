# generator-ts-from-openapi [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Create typescript application from OpenAPI definitions

## Installing helpers

```bash
npm install generator-ts-from-openapi
```

### usage

```js
const Generator = require('yeoman-generator');
const { loadPreset, resolveNamingData, appendTpl } = require('generator-ts-from-openapi');

module.exports = class extends Generator {

  async prompting() {
    const preset = await loadPreset(this);
    const { endpoint } = preset;

    this.data = {
      endpoint,
      ...resolveNamingData(preset),
    };
  }

  writing() {
    appendTpl(this)(
      this.templatePath(`somefile.ts.ejs`),
      this.destinationPath(`somefile.ts`),
      this.data
    )
  }
};
```

## Installing as a generator generator (WIP)

First, install [Yeoman](http://yeoman.io) and generator-ts-from-openapi using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-ts-from-openapi
```

Then generate your new project:

```bash
yo ts-from-openapi
```


## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

Apache-2.0 © [Kevin Giguere L]()


[npm-image]: https://badge.fury.io/js/generator-ts-from-openapi.svg
[npm-url]: https://npmjs.org/package/generator-ts-from-openapi
[travis-image]: https://travis-ci.com/kevthunder/generator-ts-from-openapi.svg?branch=master
[travis-url]: https://travis-ci.com/kevthunder/generator-ts-from-openapi
[daviddm-image]: https://david-dm.org/kevthunder/generator-ts-from-openapi.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/kevthunder/generator-ts-from-openapi
[coveralls-image]: https://coveralls.io/repos/kevthunder/generator-ts-from-openapi/badge.svg
[coveralls-url]: https://coveralls.io/r/kevthunder/generator-ts-from-openapi
