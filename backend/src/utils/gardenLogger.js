function gardenLog(message) {
  const time = new Date().toISOString();
  console.log(`[BugGarden ${time}] ${message}`);
}

module.exports = gardenLog;
