export default [
  { name: 'ControlType', address: 'cnc_sysinfo.cnc_type' },
  { name: 'MachineType', address: 'cnc_sysinfo.mt_type' },
  { name: 'AutomaticOp', address: 'cnc_statinfo.run' },
  { name: 'MSTB', address: 'cnc_statinfo.mstb' },
  { name: 'AxisMovement', address: 'cnc_statinfo.motion' },
  { name: 'Alarm', address: 'cnc_statinfo.alarm' },
  { name: 'Mode', address: 'cnc_statinfo.aut' },
  { name: 'JogOvr', address: 'cnc_rdopnlsgnl.jog_ovrd' },
  { name: 'FeedOvr', address: 'cnc_rdopnlsgnl.feed_ovrd' },
  { name: 'RpdOvr', address: 'cnc_rdopnlsgnl.rpd_ovrd' },
  { name: 'BDL', address: 'cnc_rdopnlsgnl.blck_del' },
  { name: 'SBL', address: 'cnc_rdopnlsgnl.sngl_blck' },
  { name: 'DRY', address: 'cnc_rdopnlsgnl.dry_run' },
  { name: 'PNumber', address: 'cnc_rdprgnum.data' },
  { name: 'MPNumber', address: 'cnc_rdprgnum.mdata' },
  { name: 'PathName', address: 'cnc_exeprgname2.path_name' },
  { name: 'FilePath', address: 'cnc_pdf_rdmain.file_path' }
];
