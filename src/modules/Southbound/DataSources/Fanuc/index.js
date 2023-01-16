const { exit } = require('process');
const Library = require('ffi-napi').Library;
const ref = require('ref');
const StructType = require('ref-struct');
const ArrayType = require('ref-array');
const UnionType = require('ref-union');

/** ENV Check */
// if (!(process.env.ARCH || process.env.BITS)) {
//   console.log(`Architecture or address bits not defined.`);
//   exit(1);
// }

if (!process.env.IP) {
  console.log(`No PLC address defined.`);
  exit(1);
}

if (!process.env.PORT) {
  console.log(`No PLC port defined.`);
  exit(1);
}
/**  */

// console.log(
//   `Importing ./sdk/${process.env.ARCH}/${process.env.BITS}/libfwlib32.so.1.0.4`
// );
// const sharedLibPath = `./sdk/${process.env.ARCH}/${process.env.BITS}/libfwlib32.so.1.0.4`;
const sharedLibPath = `./libfwlib32.so.1.0.4`;

// typedef struct odbsys {
//   short   addinfo ;    /* Additional information */
//   short   max_axis ;   /* Max. controlled axes */
//   char    cnc_type[2] ;/* Kind of CNC (ASCII) */
//   char    mt_type[2] ; /* Kind of M/T/TT (ASCII) */
//   char    series[4] ;  /* Series number (ASCII) */
//   char    version[4] ; /* Version number (ASCII) */
//   char    axes[2] ;   /* Current controlled axes(ASCII)*/
// } ODBSYS ;

// Test Maschine I Modell A
const odbsys = StructType({
  addinfo: ref.types.short,
  max_axis: ref.types.short,
  cnc_type: ArrayType(ref.types.char, 2), // 2
  mt_type: ArrayType(ref.types.char, 2), // 2
  series: ArrayType(ref.types.char, 4), // 4
  version: ArrayType(ref.types.char, 4), // 4
  axes: ArrayType(ref.types.char, 2) // 2
});

// typedef struct iodbtimer {
//   short   type ;          /* Spec. of date or time. */
//   short   dummy ;         /* Not used. */
//   union {
//           struct {
//                   short   year ;  /* Year. */
//                   short   month ; /* Month. */
//                   short   date ;  /* Date. */
//           } date ;
//           struct {
//                   short   hour ;  /* Hour. */
//                   short   minute ;/* Minute. */
//                   short   second ;/* Second. */
//           } time ;
//   } data ;
// } IODBTIMER ;

const iodbtimer = StructType({
  type: ref.types.short,
  dummy: ref.types.short,
  data: UnionType({
    date: StructType({
      year: ref.types.short,
      month: ref.types.short,
      date: ref.types.short
    }),
    time: StructType({
      hour: ref.types.short,
      minute: ref.types.short,
      second: ref.types.short
    })
  })
});

const lib = new Library(sharedLibPath, {
  // FWLIBAPI short WINAPI cnc_startupprocess(LONG logLevel, const char * filename);
  cnc_startupprocess: ['short', ['long', 'char *']],
  // FWLIBAPI short WINAPI cnc_exitprocess();
  cnc_exitprocess: ['short', []],
  // FWLIBAPI short WINAPI cnc_allclibhndl3( const char * IP, unsigned short PORT, LONG TIMEOUT, unsigned short * HANDLE);
  cnc_allclibhndl3: [
    'short',
    ['char *', 'ushort', 'int', ref.refType(ref.types.ushort)]
  ],
  // FWLIBAPI short WINAPI cnc_sysinfo( unsigned short, ODBSYS * ) ;
  cnc_sysinfo: ['short', ['ushort', ref.refType(odbsys)]],
  cnc_gettimer: ['short', ['ushort', ref.refType(iodbtimer)]]
});

// console.log(`System architecture: ${process.arch}`);

const ip = process.env.IP;
const port = parseInt(process.env.PORT, 10);

const logName = 'fanuc.log';
// console.log(`Register log file: ${logName} `);
const logRes = lib.cnc_startupprocess(3, ref.allocCString(logName));
if (logRes !== 0) {
  // console.log(`Registration of log file failed with status code: ${logRes}`);
} else {
  // console.log(`Registration of log file successfully.`);
}

// console.log(`Setup`);

const handle = ref.types.ushort;
const handlePtr = ref.alloc(handle);

const ipPtr = ref.allocCString(ip);

console.log(`Try to connect to ${ip} on port ${process.env.PORT}`);

const constatus = lib.cnc_allclibhndl3(ipPtr, port, 10, handlePtr);
if (constatus !== 0) {
  console.log(`Connection failed with error code: ${constatus}`);
  console.log(lib.cnc_exitprocess());
  exit(1);
} else {
  console.log(`Connection to ${ip}:${port} successfully.`);
}

const info = new odbsys();

// console.log('Handle');
// console.log(handle);
// console.log(handlePtr.deref());

// console.log('Info');
// console.log(info);
// console.log('Info Ref');
// console.log(info.ref());
// console.log('Size of Info Ref');
// console.log(info.ref().length);

try {
  console.log('Reading cnc_sysinfo');
  const sysinfostatus = lib.cnc_sysinfo(handlePtr.deref(), info.ref());
  console.log(`status: ${sysinfostatus}`);
  // console.log(`cnc_sysinfo:`);
  // console.log(info);
  console.log('cnc_sysinfo.series: ' + info.series.buffer.toString());
  console.log('cnc_sysinfo.addinfo: ' + info.addinfo);
  console.log('cnc_sysinfo.max_axis: ' + info.max_axis);
  console.log('cnc_sysinfo.mt_type: ' + info.mt_type.buffer.toString());
  console.log('cnc_sysinfo.version: ' + info.version.buffer.toString());
  console.log('cnc_sysinfo.axes: ' + info.axes.buffer.toString());
  console.log('cnc_sysinfo.cnc_type: ' + info.cnc_type.buffer.toString());
} catch (e) {
  console.log('Error while reading cnc_sysinfo');
  console.log(e);
  console.log(JSON.stringify(e));
}

const start = Date.now();
const time = new iodbtimer();
time.type = 1;

const readTime = (i) => {
  try {
    console.log('Reading cnc_gettimer');
    const timerstatus = lib.cnc_gettimer(handlePtr.deref(), time.ref());
    console.log(`Status: ${timerstatus}`);
    const {
      data: {
        // date: { year, month, date },
        time: { hour, minute, second }
      }
    } = time;
    // console.log(
    //   `${i}: (${Date.now() - start}ms since start) ${hour}:${minute}:${second}`
    // );
    console.log(`${hour}:${minute}:${second}`);
  } catch (e) {
    console.log('Error while reading cnc_gettimer');
    console.log(e);
    console.log(JSON.stringify(e));
  }
};

const loop = async (n) => {
  let i = 0;
  while (i < n) {
    readTime(i);
    await new Promise((res) => setTimeout(() => res(), 1));
    i++;
  }
};

loop(1);

console.log('Finish');
