module.exports = {
  token: `ENTER TOKEN HERE`,
  commandPrefix: `r/`,
  colors: {
    primary: { hex: 0xffc916, hexString: '#FFC916' }, // realme yellow
  },
  resources: {
    userIds: {
      gamr13: '181530227476791306',
      mrjeeves: '227453448499625985',
    },
    channelIds: {
      realme_x_series: '633537276588064768',
      whitelistedChannels: [
        '455746768353755139', // #general in Emojis
        '729418543581495398', // #greetings in Emojis
      ],
    },
    urls: {
      guideUrl: 'https://giffgaff.davwheat.dev/realme/x2-pro',
    },
    emojis: {
      loading: '<a:loading:729422181402017922>',
      fail: '<:failed:729479448512036965>',
      success: ':white_check_mark:',
      ping: '<:ping:729465705124331531>',
      roundTripPing: '<:roundtrip:729463810460745810>',
      outageNone: '<:outageNone:729470302328717424>',
      outageMinor: '<:outageMinor:729470302026727446>',
      outageMajor: '<:outageMajor:729470302316396626>',
      outageCritical: '<:outageCritical:729470302513528882>',
      outageUnknown: '<:outageUnknown:729471104749404162>',
    },
  },
};
