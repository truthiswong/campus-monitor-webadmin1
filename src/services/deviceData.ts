import { GET, POST } from "../utils/request";

export default {
  getAllPMDataBySitesAndPMs(data: { current: number; pmCodeList: string[]; siteIdList: []; size: number }) {
    return GET("/device-data/getAllPMDataBySitesAndPMs", data);
  },
  getFactoryPMByParkId(data: { type: string }) {
    return POST("/device-data/getFactoryPMByParkId", data);
  },
  getConcernSiteData(data: { pmCode: string }) {
    return POST("/device-data/getConcernSiteData", data);
  },
  getParkMapData(data: { pmCode: string }) {
    return POST("/device-data/getParkMapData", data);
  },
  get24HourDatas(data: { pmCode: string; siteId: string }) {
    return POST("/device-data-history/get24HourDatas", data);
  },
  getAllPMDataLogin() {
    return GET("/device-data/getAllPMDataLogin");
  },
  getAllPM24HourDatasBySiteId(data: { siteId: string }) {
    return POST("/device-data-history/getAllPM24HourDatasBySiteId", data);
  },
  getAllPM24HourDatasLogin(data: { pmType: number }) {
    return POST("/device-data-history/getAllPM24HourDatasLogin", data);
  },
  getAllPM20DayDatasBySiteId(data: { siteId: string }) {
    return POST("/device-data-history/getAllPM20DayDatasBySiteId", data);
  },
  getAllPM7DayDatasLogin(data: { pmType: number }) {
    return POST("/device-data-history/getAllPM7DayDatasLogin", data);
  },
  getAllSitesPM7DayDatasByFactoryId(data: { pmType: number }) {
    return POST("/device-data-history/getAllSitesPM7DayDatasByFactoryId", data);
  },
};
