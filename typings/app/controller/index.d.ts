// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAlipayOrder from '../../../app/controller/alipay/order';
import ExportQiyeKqReport from '../../../app/controller/qiye/kq/report';
import ExportQiyeXfReport from '../../../app/controller/qiye/xf/report';

declare module 'egg' {
  interface IController {
    alipay: {
      order: ExportAlipayOrder;
    }
    qiye: {
      kq: {
        report: ExportQiyeKqReport;
      }
      xf: {
        report: ExportQiyeXfReport;
      }
    }
  }
}
