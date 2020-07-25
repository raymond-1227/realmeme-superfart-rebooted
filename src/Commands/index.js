const Help = require('./Generic/Help');

const SendGuideUrl = require('./Realme/SendGuideUrl');
const TheBestRomIsALie = require('./Realme/TheBestRomIsALie');

// Android Utils
const Magisk = require('./Android_Utils/Magisk');
const XDA = require('./Android_Utils/XDA');

// Apps
const ViperInstallation = require('./Android_Utils/Apps/ViperInstallation');

// Admin
const ChangeStatus = require('./Admin/ChangeStatus');
const CleanUp = require('./Admin/CleanUp');
const Diagnostics = require('./Admin/Diagnostics');

module.exports = [
  Help,
  SendGuideUrl,
  TheBestRomIsALie,
  Magisk,
  ViperInstallation,
  XDA,
  ChangeStatus,
  CleanUp,
  Diagnostics,
];
