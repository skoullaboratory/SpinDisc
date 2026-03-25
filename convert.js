const pngToIco = require('png-to-ico');
const fs = require('fs');

pngToIco('img/SpinDiscLogo.png')
  .then(buf => {
    fs.writeFileSync('img/SpinDiscLogo.ico', buf);
    console.log('Successfully converted SpinDiscLogo.png to SpinDiscLogo.ico');
  })
  .catch(err => {
    console.error('Error converting icon:', err);
    process.exit(1);
  });
