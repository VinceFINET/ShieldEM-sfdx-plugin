import { test, expect } from "@salesforce/command/lib/test";
import TimeUtility from "../../../../../src/utils/time/timeutility";
import { ensureJsonMap, ensureString } from "@salesforce/ts-types";

const TEST_COMMAND: string = "shield:em:eventlog:metadatas";

const TEST_ARG_USERNAME_FLAG: string = "--targetusername";
const TEST_ARG_USERNAME_VALUE: string = "test@org.com";

const TEST_ARG_EVENTTYPE_SHORTFLAG: string = "-t";
const TEST_ARG_EVENTTYPE_LONGFLAG: string = "--eventtype";
const TEST_ARG_EVENTTYPE_VALUE: string = "API";

const TEST_INTERVAL_DAILY: string = "Daily";
const TEST_INTERVAL_HOURLY: string = "Hourly" ;

const TEST_ARG_JSON_FLAG: string = "--json";

const TEST_DATASET_EVENTLOGFILE = [ 
  { Id: "0001", EventType: TEST_ARG_EVENTTYPE_VALUE, LogDate: TimeUtility.GetDateBeforeFromNow(2).toISOString(), LogFile: "xxxx", LogFileLength: 302, LogFileFieldNames: "A,B,C", LogFileFieldTypes: "string,number,boolean", Sequence: 0, Interval: TEST_INTERVAL_DAILY },
  { Id: "0002", EventType: TEST_ARG_EVENTTYPE_VALUE, LogDate: TimeUtility.GetDateBeforeFromNow(3).toISOString(), LogFile: "xxxx", LogFileLength: 302, LogFileFieldNames: "A,B,C", LogFileFieldTypes: "string,number,boolean", Sequence: 0, Interval: TEST_INTERVAL_HOURLY },
  { Id: "0004", EventType: TEST_ARG_EVENTTYPE_VALUE, LogDate: TimeUtility.GetDateBeforeFromNow(4).toISOString(), LogFile: "xxxx", LogFileLength: 302, LogFileFieldNames: "A,B,C", LogFileFieldTypes: "string,number,boolean", Sequence: 0, Interval: TEST_INTERVAL_HOURLY },
  { Id: "0005", EventType: TEST_ARG_EVENTTYPE_VALUE, LogDate: TimeUtility.GetDateBeforeFromNow(5).toISOString(), LogFile: "xxxx", LogFileLength: 302, LogFileFieldNames: "A,B,C", LogFileFieldTypes: "string,number,boolean", Sequence: 0, Interval: TEST_INTERVAL_DAILY },
  { Id: "0006", EventType: TEST_ARG_EVENTTYPE_VALUE, LogDate: TimeUtility.GetYesterday().toISOString(),          LogFile: "xxxx", LogFileLength: 302, LogFileFieldNames: "A,B,C", LogFileFieldTypes: "string,number,boolean", Sequence: 0, Interval: TEST_INTERVAL_HOURLY },
  { Id: "0007", EventType: TEST_ARG_EVENTTYPE_VALUE, LogDate: TimeUtility.GetYesterday().toISOString(),          LogFile: "xxxx", LogFileLength: 302, LogFileFieldNames: "A,B,C", LogFileFieldTypes: "string,number,boolean", Sequence: 0, Interval: TEST_INTERVAL_DAILY },
];

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
      TEST_COMMAND, TEST_ARG_EVENTTYPE_LONGFLAG, TEST_ARG_EVENTTYPE_VALUE, TEST_ARG_JSON_FLAG, TEST_ARG_USERNAME_FLAG, TEST_ARG_USERNAME_VALUE
    ])
    .it( 
      "runs "+TEST_COMMAND+" "+TEST_ARG_EVENTTYPE_LONGFLAG+" "+TEST_ARG_EVENTTYPE_VALUE+" "+TEST_ARG_JSON_FLAG+" "+TEST_ARG_USERNAME_FLAG+" "+TEST_ARG_USERNAME_VALUE+" with data from Shield Event Monitoring and JSON ouput format.",
      ctx => {
        expect(ctx.stdout).to.be.an("string");
        
        let js: any;
        try {
          js = JSON.parse(ctx.stdout);
        } catch (err) {
          expect(err.message).to.be.equal("");
        }        

        expect(js)
          .to.have.property("status")
          .to.be.equal(0);
        expect(js)
          .to.have.property("result")
          .to.be.an("array")
          .to.have.lengthOf(6);

        let result1 = js["result"][0];
        expect(result1).to.have.property("id", "0001");
        expect(result1).to.have.property("eventType", TEST_ARG_EVENTTYPE_VALUE)
        expect(result1).to.have.property("logDate");
        expect(result1).to.have.property("interval", TEST_INTERVAL_DAILY);

        let result2 = js["result"][1];
        expect(result2).to.have.property("id", "0002");
        expect(result2).to.have.property("eventType", TEST_ARG_EVENTTYPE_VALUE)
        expect(result1).to.have.property("logDate");
        expect(result1).to.have.property("interval", TEST_INTERVAL_DAILY);
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
      TEST_COMMAND, TEST_ARG_EVENTTYPE_SHORTFLAG, TEST_ARG_EVENTTYPE_VALUE, TEST_ARG_JSON_FLAG, TEST_ARG_USERNAME_FLAG, TEST_ARG_USERNAME_VALUE
    ])
    .it( 
      "runs "+TEST_COMMAND+" "+TEST_ARG_EVENTTYPE_SHORTFLAG+" "+TEST_ARG_EVENTTYPE_VALUE+" "+TEST_ARG_JSON_FLAG+" "+TEST_ARG_USERNAME_FLAG+" "+TEST_ARG_USERNAME_VALUE+" with data from Shield Event Monitoring and JSON ouput format.",
      ctx => {
        expect(ctx.stdout).to.be.an("string");
          
        let js: any;
        try {
          js = JSON.parse(ctx.stdout);
        } catch (err) {
          expect(err.message).to.be.equal("");
        }

        expect(js)
          .to.have.property("status")
          .to.be.equal(0);
        expect(js)
          .to.have.property("result")
          .to.be.an("array")
          .to.have.lengthOf(6);
        
        let result1 = js["result"][0];
        expect(result1).to.have.property("id", "0001");
        expect(result1).to.have.property("eventType", TEST_ARG_EVENTTYPE_VALUE)
        expect(result1).to.have.property("logDate");
        expect(result1).to.have.property("interval", TEST_INTERVAL_DAILY);

        let result2 = js["result"][1];
        expect(result2).to.have.property("id", "0002");
        expect(result2).to.have.property("eventType", TEST_ARG_EVENTTYPE_VALUE)
        expect(result1).to.have.property("logDate");
        expect(result1).to.have.property("interval", TEST_INTERVAL_DAILY);
      }
    );
});