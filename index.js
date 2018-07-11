#!/usr/bin/env node

const utils = require('./lib/utils');
const debug = utils.debug;
const print = require('./lib/print');
const fetchData = require('./lib/fetchData');

var collective = utils.getCollective();

if (!collective)
  process.exit(0);

if (utils.isFancyEnvironment()) {
  const promises = [];
  promises.push(fetchData.fetchStats(collective.url));
  if (collective.logo) {
    promises.push(fetchData.fetchLogo(collective.logo));
  }

  Promise.all(promises)
    .then(function(results) {
      collective.stats = results[0];
      const logotxt = results[1];

      if (logotxt) {
        print.printLogo(logotxt);
      }
      print.printFooter(collective);
      process.exit(0);     
    })
    .catch(function(e) {
      debug("Error caught: ", e);
      print.printFooter(collective);
      process.exit(0);
    })
} else {
  console.log("");
  console.log("     *** Thank you for using " + collective.slug + "! ***");
  console.log("");
  console.log("Please consider donating to our open collective");
  console.log("     to help us maintain this package.");
  console.log("");
  console.log("  " + collective.url + "/donate");
  console.log("");
  console.log("                    ***");
  console.log("");
  process.exit(0);
}
