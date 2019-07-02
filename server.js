const fetch = require('node-fetch');
const linebot = require('linebot');
const bot = linebot({
  channelId: process.env.channelId,
  channelSecret: process.env.channelSecret,
  channelAccessToken: process.env.channelAccessToken
});
const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001';
const Authorization = 'CWB-A3345325-4A6E-4279-80B2-9491AF9A61B1';
const elementName = 'Wx';
const weather = [];
const getData = async() => {
  const endpoint = `${url}?Authorization=${Authorization}&elementName=${elementName}`;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const { records } = await response.json();
      const { location } = records;
      location.forEach(_location => {
        weather[_location.locationName] = _location.weatherElement[0].time[0].parameter.parameterName;
      });
    } else {
      throw new Error('Response is not ok!');
    }
  } catch (error) {
    console.log(error);
  }
};

bot.on('message', function (event) {
  getData();
  const msg = event.message.text;
  let replyMsg = '';
  console.log(msg);

  if (weather[msg]) {
    replyMsg = `${msg}:${weather[msg]}`;
  } else {
    replyMsg = '請輸入正確縣市名稱，注意: 臺(O) 台(X)';
  }

  event.reply(replyMsg).then(function (data) {
    
  }).catch(function (error) {
    console.log(error);
  });
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

const port = process.env.PORT || 3000;
app.listen('/linewebhook', port, function () {
  console.log('[BOT已準備就緒]');
});
