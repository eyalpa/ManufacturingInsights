function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTestType() {
  const types = ["TYPE_A", "TYPE_B", "TYPE_C"];
  return types[getRandomInt(0, types.length - 1)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockData(numEntries = 100) {
  const mockData = [];

  for (let i = 0; i < numEntries; i++) {
    const date = getRandomDate(new Date(2021, 0, 1), new Date());
    mockData.push({
      PN: `P-${i}`,
      TEST_TYPE: getRandomTestType(),
      PASS: getRandomInt(0, 1),
      TEST_DATE: date.toISOString().split('T')[0] // format as YYYY-MM-DD
    });
  }

  return mockData;
}

module.exports = { generateMockData };