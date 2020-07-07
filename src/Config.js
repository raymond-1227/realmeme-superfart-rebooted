const configJsonc = require('./config.jsonc');
const { jsonc } = require('jsonc');

module.exports = jsonc.parse(configJsonc);
