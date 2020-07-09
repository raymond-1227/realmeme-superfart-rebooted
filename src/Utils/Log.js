const Moment = require('moment');
const mkdirp = require('mkdirp');

// Colors
const COLORS = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

const SEVERITY = {
  ERROR: 1,
  WARN: 2,
  SUCCESS: 3,
  INFO: 4,
  DEBUG: 5,
  VERBOSE: 6,
};

function color(text, color) {
  return `${COLORS.Bright}${color}${text}${COLORS.Reset}`;
}

function CenterPad(text, desiredLength, padChar = ' ') {
  if (text.length >= desiredLength) return text;

  let out = text;

  while (out.length < desiredLength) {
    out = `${padChar}${out}`;

    if (out.length < desiredLength) {
      out = `${out}${padChar}`;
    }
  }

  return out;
}

function Log(message, severity = SEVERITY.SUCCESS) {
  const timestamp = Moment().format('YYYY-MM-DD HH:mm:ss.SSSS');

  switch (severity) {
    case SEVERITY.ERROR: {
      const msg = `${timestamp} ${color(CenterPad('ERROR', 9), COLORS.BgRed + COLORS.FgWhite)} ${message}`;
      console.error(msg);
      break;
    }

    case SEVERITY.WARN: {
      const msg = `${timestamp} ${color(CenterPad('WARNING', 9), COLORS.BgYellow + COLORS.FgWhite)} ${message}`;
      console.warn(msg);
      break;
    }

    case SEVERITY.SUCCESS: {
      const msg = `${timestamp} ${color(CenterPad('OK', 9), COLORS.BgGreen + COLORS.FgWhite)} ${message}`;
      console.log(msg);
      break;
    }

    case SEVERITY.INFO: {
      const msg = `${timestamp} ${color(CenterPad('INFO', 9), COLORS.BgBlue + COLORS.FgWhite)} ${message}`;
      console.info(msg);
      break;
    }

    case SEVERITY.DEBUG: {
      const msg = `${timestamp} ${color(CenterPad('DEBUG', 9), COLORS.BgMagenta + COLORS.FgBlack)} ${message}`;
      console.log(msg);
      break;
    }

    case SEVERITY.VERBOSE: {
      const msg = `${timestamp} ${color(CenterPad('VERBOSE', 9), COLORS.Reverse)} ${message}`;
      console.info(msg);
      break;
    }
  }
}

module.exports = Log;
module.exports.SEVERITY = SEVERITY;
module.exports.Helpers = { ...require('./LogHelpers') };
