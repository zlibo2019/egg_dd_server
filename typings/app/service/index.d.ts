// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportQiyeKqServiceDDUser from '../../../app/service/qiye/kq/serviceDDUser';
import ExportQiyeKqServiceReport from '../../../app/service/qiye/kq/serviceReport';
import ExportQiyeKqServiceSchedule from '../../../app/service/qiye/kq/serviceSchedule';
import ExportQiyeKqServiceSynRecord from '../../../app/service/qiye/kq/serviceSynRecord';
import ExportQiyeKqServiceSynUser from '../../../app/service/qiye/kq/serviceSynUser';
import ExportQiyeKqServiceUser from '../../../app/service/qiye/kq/serviceUser';
import ExportQiyeXfServiceReport from '../../../app/service/qiye/xf/serviceReport';

declare module 'egg' {
  interface IService {
    qiye: {
      kq: {
        serviceDDUser: ExportQiyeKqServiceDDUser;
        serviceReport: ExportQiyeKqServiceReport;
        serviceSchedule: ExportQiyeKqServiceSchedule;
        serviceSynRecord: ExportQiyeKqServiceSynRecord;
        serviceSynUser: ExportQiyeKqServiceSynUser;
        serviceUser: ExportQiyeKqServiceUser;
      }
      xf: {
        serviceReport: ExportQiyeXfServiceReport;
      }
    }
  }
}
