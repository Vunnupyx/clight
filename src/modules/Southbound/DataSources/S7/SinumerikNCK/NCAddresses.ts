import { NCVarSelectorAddress } from './interfaces';

/**
 * INFO: Addresses are defined in MDClite_signallist_840D_SL_4_5.awl from ticket.
 * @see ... developer-docs/MDClite_signallist_840D_SL_4_5.awl
 * @see https://jira.app.dmgmori.com/browse/DIGMDCLGHT-11?jql=project%20%3D%20DIGMDCLGHT%20AND%20NOT%20attachments%20is%20EMPTY
 */
export const NC_ADDRESSES: { [key: string]: NCVarSelectorAddress } = {
  '/Channel/ProgramPointer/progName': {
    /** @see C1_SPARP_progName1_3 */
    // /Channel/ProgramPointer/progName[1,1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x3,
    line: 0x1,
    blockType: 0x7d,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0x20
  },
  '/Channel/ChannelDiagnose/cuttingTime': {
    /** @see C1_DIAGN_cuttingTime1_10 */
    // /Channel/ChannelDiagnose/cuttingTime'[1,1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xa,
    line: 0x1,
    blockType: 0x3b,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/progStatus': {
    /** @see  C1_S_progStatus_13 */
    // /Channel/State/progStatus[1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xd,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/ProgramInfo/msg': {
    /** @see C1_SPARP_msg1_1 */
    // /Channel/ProgramInfo/msg[1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x1,
    line: 0x1,
    blockType: 0x7d,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0x80
  },
  '/Channel/ProgramInfo/workPNameLong': {
    /** @see C1_workPNameLong_12 */
    // /Channel/ProgramInfo/workPNameLong[1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xc,
    line: 0x1,
    blockType: 0x7d,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0x80
  },
  '/Channel/ProgramInfo/workPandProgName': {
    /** @see C1_workPandProgName1_16 */
    // /Channel/ProgramInfo/workPandProgName[1,1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x10,
    line: 0x1,
    blockType: 0x7d,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0xa0
  },
  '/Channel/State/specParts': {
    /** @see C1_S_specParts_122 */
    // /Channel/State/specParts[1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x7a,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/Spindle/turnState': {
    /** @see C1_SSP_turnState1_9 */
    // /Channel/Spindle/turnState[1,1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x9,
    line: 0x1,
    blockType: 0x72,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/Configuration/anLanguageOnHmi': {
    /** @see N_Y_anLanguageOnHmi1_78 */
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x4e,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/Configuration/basicLengthUnit': {
    /** @see N_Y_basicLengthUnit_2 */
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/Configuration/nckType': {
    /** @see N_Y_nckType_31 */
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x1f,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/Configuration/nckVersion': {
    /** @see  N_Y_nckVersion_32 */
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x20,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/chanStatus': {
    /** @see C1_S_chanStatus_11 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xb,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/ProgramModification/optStopActive': {
    /** @see C1_SINF_optStopActive_10 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xa,
    line: 0x1,
    blockType: 0x7e,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/ProgramModification/progTestActive': {
    /** @see  C1_progTestActive_16 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x10,
    line: 0x1,
    blockType: 0x7e,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/ProgramModification/trialRunActive': {
    /** @see  C1_SINF_trialRunActive_9 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x9,
    line: 0x1,
    blockType: 0x7e,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/MachineAxis/feedRateOvr': {
    /** @see  C1_S_rapFeedRateOvr_4 */
    // /Nck/MachineAxis/feedRateOvr[1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/actProgNetTime': {
    /** @see C1_S_actProgNetTime1_297 */
    // /Channel/State/actProgNetTime[u1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x129,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Bag/State/OpMode': {
    /** @see  B1_S_opMode_3 */
    syntaxId: 0x82,
    areaUnit: 0x21,
    column: 0x3,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/ProgramModification/singleBlockActive': {
    /** @see  C1_singleBlockActive_12 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xc,
    line: 0x1,
    blockType: 0x7e,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/Programinfo/selectedWorkPProg': {
    /** @see  C1_selectedWorkPProg1_35 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x23,
    line: 0x1,
    blockType: 0x7d,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0xa0
  },
  '/Channel/State/feedRateIpoOvr': {
    /** @see C1_S_feedRateIpoOvr_3 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x3,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  // TODO: NOT FOUND in FILE
  '/Channel/Configuration/numSpindles': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0xa2
  },
  // TODO: NOT FOUND in FILE
  '/Channel/Spindle/SpindleType': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xd,
    line: 0x1,
    blockType: 0x72,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/Spindle/speedOvr': {
    /** @see  C1_SSP_speedOvr1_4 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x72,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/rapFeedRateOvr': {
    /** @see  C1_S_rapFeedRateOvr_4 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/totalParts': {
    /** @see C1_S_totalParts_120 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x78,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/reqParts': {
    /** @see C1_S_reqParts_119 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x77,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/actParts': {
    /** @see C1_S_actParts_121 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x79,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/actTNumber': {
    /** @see  C1_S_actTNumber_23 */
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x17,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/State/numAlarms': {
    /** @see  N_S_numAlarms_7 */
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x7,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  // TODO: NOT FOUND in FILE
  '/Nck/Configuration/maxnumAlarms': {
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x13,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  // TODO: NOT FOUND in FILE
  '/Nck/SequencedAlarms/alarmNo': {
    // N_SALA_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x77,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  // TODO: NOT FOUND in FILE
  '/Nck/AlarmEvent/alarmNo': {
    // N_SALAC_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x54,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  // TODO: NOT FOUND in FILE
  '/Nck/LastAlarm/alarmNo': {
    // N_SALAL_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x75,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  // TODO: NOT FOUND in FILE
  '/Nck/TopPrioAlarm/alarmNo': {
    // N_SALAP_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x76,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  // only for long time memory leak testing
  '/fake/address/1': {
    // to test invalid addresses
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x76,
    numOfLine: 0x100,
    dataType: 0x7,
    byteLength: 0x4
  }
};
