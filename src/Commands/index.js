const Help = require('./Generic/Help');
const LMGTFY = require('./Generic/LMGTFY');

const SendGuideUrl = require('./Realme/SendGuideUrl');
const TheBestRomIsALie = require('./Realme/TheBestRomIsALie');
const FAQ = require('./Realme/faq');

// Android Utils
const Magisk = require('./Android_Utils/Magisk');
const XDA = require('./Android_Utils/XDA');

// Apps
const JamesDSP = require('./Android_Utils/Apps/JamesDSP');
const ViperInstallation = require('./Android_Utils/Apps/ViperInstallation');

// Admin
const ChangeStatus = require('./Admin/ChangeStatus');
const CleanUp = require('./Admin/CleanUp');
const Diagnostics = require('./Admin/Diagnostics');

module.exports = [
  Help,
  LMGTFY,
  SendGuideUrl,
  TheBestRomIsALie,
  FAQ,
  Magisk,
  JamesDSP,
  ViperInstallation,
  XDA,
  ChangeStatus,
  CleanUp,
  Diagnostics,
];
