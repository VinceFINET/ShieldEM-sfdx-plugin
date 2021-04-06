import { test, expect } from "@salesforce/command/lib/test";
import { ensureString } from "@salesforce/ts-types";
import TimeUtility from "../../../../../src/utils/time/timeutility";

const TEST_COMMAND: string = "shield:em:stats:apexentrypoints";

const TEST_ARG_USERNAME_FLAG: string = "--targetusername";
const TEST_ARG_USERNAME_VALUE: string = "test@org.com";

const TEST_ARG_JSON_FLAG: string = "--json";

const TEST_EVENTYPE_APEXEXECUTION: string = 'ApexExecution';
const TEST_INTERVAL_DAILY: string = 'Daily';

const TEST_FILE1_URL: string = '/file1';
const TEST_FILE2_URL: string = '/file2';
const TEST_FILE3_URL: string = '/file3';

const TEST_CLASS1: string = 'MyClass1';
const TEST_CLASS2: string = 'MyClass2';
const TEST_CLASS3: string = 'MyClass3';

const TEST_DATASET_EVENTLOGFILE = [
  { ID: '0001', EventType: TEST_EVENTYPE_APEXEXECUTION, Interval: TEST_INTERVAL_DAILY, LogFile: TEST_FILE1_URL, LogFileLength: 1200, LogDate: TimeUtility.GetDateBeforeFromNow(2).toISOString() },
  { ID: '0002', EventType: TEST_EVENTYPE_APEXEXECUTION, Interval: TEST_INTERVAL_DAILY, LogFile: TEST_FILE2_URL, LogFileLength: 1300, LogDate: TimeUtility.GetDateBeforeFromNow(4).toISOString() },
  { ID: '0003', EventType: TEST_EVENTYPE_APEXEXECUTION, Interval: TEST_INTERVAL_DAILY, LogFile: TEST_FILE3_URL, LogFileLength: 1400, LogDate: TimeUtility.GetDateBeforeFromNow(3).toISOString() }
];

const TEST_DATASET_FILE1 = [
  { ID: '0001', ENTRY_POINT: TEST_CLASS1+'.MethodA', CPU_TIME: 300 },
  { ID: '0002', ENTRY_POINT: TEST_CLASS1+'.MethodB', CPU_TIME: 100 },
  { ID: '0003', ENTRY_POINT: TEST_CLASS1+'.MethodA', CPU_TIME: 30 },
  { ID: '0004', ENTRY_POINT: TEST_CLASS2+'.MethodD', CPU_TIME: 500 },
];
const TEST_DATASET_FILE2 = [
  { ID: '0010', ENTRY_POINT: TEST_CLASS1+'.MethodA', CPU_TIME: 300 },
  { ID: '0011', ENTRY_POINT: TEST_CLASS2+'.MethodB', CPU_TIME: 200 },
  { ID: '0012', ENTRY_POINT: TEST_CLASS2+'.MethodA', CPU_TIME: 50 },
  { ID: '0013', ENTRY_POINT: TEST_CLASS1+'.MethodD', CPU_TIME: 400 },
];
const TEST_DATASET_FILE3 = [
  { ID: '0020', ENTRY_POINT: TEST_CLASS1+'.MethodA', CPU_TIME: 200 },
  { ID: '0021', ENTRY_POINT: TEST_CLASS1+'.MethodB', CPU_TIME: 900 },
  { ID: '0022', ENTRY_POINT: TEST_CLASS3+'.MethodA', CPU_TIME: 20 },
  { ID: '0023', ENTRY_POINT: TEST_CLASS3+'.MethodD', CPU_TIME: 800 },
];

describe(TEST_COMMAND, () => {
    test
      .withOrg({ username: TEST_ARG_USERNAME_VALUE }, true)
      .withConnectionRequest(request => {
        // File URL case
        if (typeof request == 'string') {
          switch (request) {
            case TEST_FILE1_URL: return Promise.resolve(TEST_DATASET_FILE1);
            case TEST_FILE2_URL: return Promise.resolve(TEST_DATASET_FILE2);
            case TEST_FILE3_URL: return Promise.resolve(TEST_DATASET_FILE3);
          }
        }
        // Query case
        if (typeof request == 'object') {
          // Query on EventLogFile object
          if (ensureString(request['url']).match(/EventLogFile/)) {
            return Promise.resolve({ records: TEST_DATASET_EVENTLOGFILE });
          }
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
            .to.have.lengthOf(3);
          
          let res: Array<any> = js['result'];
          expect(res[0])
            .to.have.property('class')
            .to.be.equal(TEST_CLASS1);
          expect(res[1])
            .to.have.property('class')
            .to.be.equal(TEST_CLASS2);
          expect(res[2])
            .to.have.property('class')
            .to.be.equal(TEST_CLASS3);
        }
      );
});

describe(TEST_COMMAND, () => {
  test
    .withOrg({ username: TEST_ARG_USERNAME_VALUE }, true)
    .withConnectionRequest(request => {
      // File URL case
      if (typeof request == 'string') {
        switch (request) {
          case TEST_FILE1_URL: return Promise.resolve(TEST_DATASET_FILE1);
          case TEST_FILE2_URL: return Promise.resolve(TEST_DATASET_FILE2);
          case TEST_FILE3_URL: return Promise.resolve(TEST_DATASET_FILE3);
        }
      }
      // Query case
      if (typeof request == 'object') {
        // Query on EventLogFile object
        if (ensureString(request['url']).match(/EventLogFile/)) {
          return Promise.resolve({ records: TEST_DATASET_EVENTLOGFILE });
        }
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
          .to.have.lengthOf(6);
        expect(lines[0]).to.include('CLASS ');
        expect(lines[0]).to.include(' METRIC ');
        expect(lines[0]).to.include(' AVG');
        expect(lines[1]).to.include('───');
        expect(lines[2]).to.include(TEST_CLASS1);
        expect(lines[3]).to.include(TEST_CLASS2);
        expect(lines[4]).to.include(TEST_CLASS3);
        expect(lines[5]).to.equal('');
      }
    );
});