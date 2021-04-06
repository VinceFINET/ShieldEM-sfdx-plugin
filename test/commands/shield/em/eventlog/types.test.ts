import { test, expect } from "@salesforce/command/lib/test";
import { ensureJsonMap, ensureString } from "@salesforce/ts-types";

const TEST_COMMAND: string = "shield:em:eventlog:types";

const TEST_ARG_USERNAME_FLAG: string = "--targetusername";
const TEST_ARG_USERNAME_VALUE: string = "test@org.com";

const TEST_ARG_JSON_FLAG: string = "--json";

const TEST_EVENTYPE_APEXEXECUTION: string = 'ApexExecution';
const TEST_EVENTYPE_API: string =  'API';
const TEST_INTERVAL_DAILY: string = 'Daily';
const TEST_INTERVAL_HOURLY: string = 'Hourly' ;
const TEST_COUNT_APEXEXECDAILY: number = 10;
const TEST_COUNT_APEXEXECHOURLY: number = 3;
const TEST_COUNT_APIDAILY: number = 19;
const TEST_COUNT_APIHOURLY: number = 0;

const TEST_DATASET_EVENTLOGFILE = [ 
  { EventType: TEST_EVENTYPE_APEXEXECUTION, Interval: TEST_INTERVAL_DAILY,  Total: TEST_COUNT_APEXEXECDAILY },
  { EventType: TEST_EVENTYPE_APEXEXECUTION, Interval: TEST_INTERVAL_HOURLY, Total: TEST_COUNT_APEXEXECHOURLY },
  { EventType: TEST_EVENTYPE_API,           Interval: TEST_INTERVAL_DAILY,  Total: TEST_COUNT_APIDAILY }
];

const TEST_DATASET_EMPTY = [ ];

describe(TEST_COMMAND, () => {
  test
    .withOrg({ username: TEST_ARG_USERNAME_VALUE }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match(/EventLogFile/)) {
        return Promise.resolve({ records: TEST_DATASET_EVENTLOGFILE }); 
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command([
      TEST_COMMAND, TEST_ARG_JSON_FLAG, TEST_ARG_USERNAME_FLAG, TEST_ARG_USERNAME_VALUE
    ])
    .it( 
      'runs '+TEST_COMMAND+' '+TEST_ARG_JSON_FLAG+' '+TEST_ARG_USERNAME_FLAG+' '+TEST_ARG_USERNAME_VALUE+' with data from Shield Event Monitoring and JSON ouput format.',
      ctx => {
        expect(ctx.stdout).to.be.an('string');

        let js: any;
        try {
          js = JSON.parse(ctx.stdout);
        } catch (err) {
          expect(err.message).to.be.equal('');
        }

        expect(js)
          .to.have.property('status')
          .to.be.equal(0);
        expect(js)
          .to.have.property('result')
          .to.be.an('array')
          .to.have.lengthOf(2);

        let result1 = js['result'][0];
        expect(result1).to.have.property('apiname', TEST_EVENTYPE_APEXEXECUTION);
        expect(result1).to.have.property('dailyCount', TEST_COUNT_APEXEXECDAILY)
        expect(result1).to.have.property('hourlyCount', TEST_COUNT_APEXEXECHOURLY);

        let result2 = js['result'][1];
        expect(result2).to.have.property('apiname', TEST_EVENTYPE_API)
        expect(result2).to.have.property('dailyCount', TEST_COUNT_APIDAILY)
        expect(result2).to.have.property('hourlyCount', TEST_COUNT_APIHOURLY);
      }
    );
});

describe(TEST_COMMAND, () => {
  test
    .withOrg({ username: TEST_ARG_USERNAME_VALUE }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match(/EventLogFile/)) {
        return Promise.resolve({ records: TEST_DATASET_EVENTLOGFILE }); 
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command([
      TEST_COMMAND, TEST_ARG_USERNAME_FLAG, TEST_ARG_USERNAME_VALUE
    ])
    .it( 
      'runs '+TEST_COMMAND+' '+TEST_ARG_USERNAME_FLAG+' '+TEST_ARG_USERNAME_VALUE+' with data from Shield Event Monitoring and text ouput format.',
      ctx => {
        expect(ctx.stdout).to.be.an('string');
        let lines: Array<string> = ctx.stdout.split('\n');
        expect(lines)
          .to.be.an('array')
          .to.have.lengthOf(5);
        expect(lines[0]).to.include('APINAME ');
        expect(lines[0]).to.include(' DAILY COUNT ');
        expect(lines[0]).to.include(' HOURLY COUNT');
        expect(lines[1]).to.include('───');
        expect(lines[2]).to.include(TEST_EVENTYPE_APEXEXECUTION + ' ');
        expect(lines[2]).to.include(' ' + TEST_COUNT_APEXEXECDAILY + ' ');
        expect(lines[2]).to.include(' ' + TEST_COUNT_APEXEXECHOURLY);
        expect(lines[3]).to.include(TEST_EVENTYPE_API + ' ');
        expect(lines[3]).to.include(' ' + TEST_COUNT_APIDAILY + ' ');
        expect(lines[3]).to.include(' ' + TEST_COUNT_APIHOURLY);
        expect(lines[4]).to.equal('');
      }
    );
});

describe(TEST_COMMAND, () => {
  test
    .withOrg({ username: TEST_ARG_USERNAME_VALUE }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match(/EventLogFile/)) {
        return Promise.resolve({ records: TEST_DATASET_EMPTY }); 
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command([
      TEST_COMMAND, TEST_ARG_JSON_FLAG, TEST_ARG_USERNAME_FLAG, TEST_ARG_USERNAME_VALUE
    ])
    .it( 
      'runs '+TEST_COMMAND+' '+TEST_ARG_JSON_FLAG+' '+TEST_ARG_USERNAME_FLAG+' '+TEST_ARG_USERNAME_VALUE+' without data from Shield Event Monitoring and JSON ouput.',
      ctx => {
        expect(ctx.stdout).to.be.an('string');

        let js: any;
        try {
          js = JSON.parse(ctx.stdout);
        } catch (err) {
          expect(err.message).to.be.equal('');
        }
        expect(js)
          .to.have.property('status')
          .to.be.equal(0);
        expect(js)
          .to.have.property('result')
          .to.be.an('array')
          .to.have.lengthOf(0);
      }
    );
});

describe(TEST_COMMAND, () => {
  test
    .withOrg({ username: TEST_ARG_USERNAME_VALUE }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match(/EventLogFile/)) {
        return Promise.resolve({ records: TEST_DATASET_EMPTY }); 
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command([
      TEST_COMMAND, TEST_ARG_USERNAME_FLAG, TEST_ARG_USERNAME_VALUE
    ])
    .it( 
      'runs '+TEST_COMMAND+' '+TEST_ARG_USERNAME_FLAG+' '+TEST_ARG_USERNAME_VALUE+' without data from Shield Event Monitoring and text ouput format.',
      ctx => {
        expect(ctx.stdout).to.be.an('string');
        let lines: Array<string> = ctx.stdout.split('\n');
        expect(lines)
          .to.be.an('array')
          .to.have.lengthOf(3);
        expect(lines[0]).to.include('APINAME ');
        expect(lines[0]).to.include(' DAILY COUNT ');
        expect(lines[0]).to.include(' HOURLY COUNT');
        expect(lines[1]).to.include('───');
        expect(lines[2]).to.equal('');
      }
    );
});