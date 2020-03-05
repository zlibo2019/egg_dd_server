// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportMSGSEND from '../../../app/model/MSG_SEND';
import ExportDtUser from '../../../app/model/dt_user';
import ExportKtJl from '../../../app/model/kt_jl';

declare module 'sequelize' {
  interface Sequelize {
    MSGSEND: ReturnType<typeof ExportMSGSEND>;
    DtUser: ReturnType<typeof ExportDtUser>;
    KtJl: ReturnType<typeof ExportKtJl>;
  }
}
