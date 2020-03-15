import { action, observable, computed } from "mobx";
import api from "services";
import { notification } from "antd";
import { allSiteRes, Tree, ConcernSiteData } from "../../type";
import { _ } from "utils/lodash";

export class ParkScreenMapStore {
  //@ts-ignore
  @observable map: BMap.Map = null;
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 16;
  @observable polygonPath = [
    { lng: 120.990022, lat: 31.3717 },
    { lng: 120.970045, lat: 31.3702 },
    { lng: 120.981034, lat: 31.3616 }
  ];
  @observable compamys = [
    [
      { lng: 120.985022, lat: 31.3687 },
      { lng: 120.985022, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3687 }
    ],
    [
      { lng: 120.983022, lat: 31.3657 },
      { lng: 120.983022, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3657 }
    ],
    [
      { lng: 120.980022, lat: 31.3657 },
      { lng: 120.980022, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3657 }
    ],
    [
      { lng: 120.980022, lat: 31.3687 },
      { lng: 120.980022, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3687 }
    ]
  ];
  @observable offset = {
    width: 0,
    height: -20
  };
  @observable pointsc = [
    { position: { lng: 120.985072, lat: 31.3681 }, mapPos: { left: "376px", top: "157px" }, number: 123 },
    { position: { lng: 120.985622, lat: 31.3683 }, mapPos: { left: "392px", top: "150px" }, number: 23 },
    { position: { lng: 120.985642, lat: 31.3682 }, mapPos: { left: "392px", top: "153px" }, number: 12 },
    { position: { lng: 120.983022, lat: 31.3659 }, mapPos: { left: "319px", top: "228px" }, number: 23 },
    { position: { lng: 120.983032, lat: 31.36556 }, mapPos: { left: "320px", top: "239px" }, number: 12 },
    { position: { lng: 120.983642, lat: 31.36513 }, mapPos: { left: "337px", top: "253px" }, number: 34 },
    { position: { lng: 120.983612, lat: 31.36523 }, mapPos: { left: "336px", top: "250px" }, number: 23 },
    { position: { lng: 120.980092, lat: 31.36588 }, mapPos: { left: "238px", top: "229px" }, number: 34 },
    { position: { lng: 120.980022, lat: 31.36543 }, mapPos: { left: "236px", top: "243px" }, number: 23 },
    { position: { lng: 120.980632, lat: 31.3653 }, mapPos: { left: "253px", top: "247px" }, number: 12 },
    { position: { lng: 120.980642, lat: 31.3654 }, mapPos: { left: "253px", top: "244px" }, number: 23 },
    { position: { lng: 120.980072, lat: 31.36865 }, mapPos: { left: "237px", top: "139px" }, number: 43 },
    { position: { lng: 120.980022, lat: 31.36856 }, mapPos: { left: "236px", top: "142px" }, number: 11 },
    { position: { lng: 120.980682, lat: 31.36813 }, mapPos: { left: "254px", top: "156px" }, number: 22 }
  ];
  @observable compname = [
    { position: { lng: 120.985022, lat: 31.3687 }, name: "化工西北" },
    { position: { lng: 120.983022, lat: 31.3657 }, name: "长润发" },
    { position: { lng: 120.980022, lat: 31.3657 }, name: "群力化工" }
  ];
  @observable gasData = [] as any;
  @observable waterData = [] as any;
  @observable allSites: Tree = [];
  @observable allParks: Array<{
    id: string;
    parkNo: string;
    parkName: string;
    remark: string;
    selected: boolean;
  }> = [] as any;

  // 初始化
  @action.bound
  async init() {
    const [{ data: gasData }, { data: waterData }, allSiteResult, { data: allParks }] = await Promise.all([
      api.DeviceData.getFactoryPMByParkId({ type: "1" }),
      api.DeviceData.getFactoryPMByParkId({ type: "2" }),
      api.DeviceSite.getAllSitesByParkId(),
      api.Park.getAllParksSelect()
    ]);

    if (this.currentPmCode) {
      this.loadConcernSiteData(this.currentPmCode);
    }

    const _allSite: allSiteRes = allSiteResult.data;
    const allSites = _allSite.map(i => ({
      title: i.companyName,
      key: `company-${i.companyId}`,
      children: i.factorys
        ? i.factorys.map(factory => ({
            key: `factory-${factory.factoryId}`,
            title: factory.factoryName,
            children: factory.sites
              ? factory.sites.map(site => ({
                  key: site.siteId,
                  title: site.siteName,
                  selected: site.concern
                }))
              : []
          }))
        : []
    }));

    Object.assign(this, {
      gasData,
      waterData,
      allSites,
      allParks
    });
    let selectedSites: string[] = [];
    this.allSites.forEach(park => {
      park.children?.forEach(factory => {
        factory.children?.forEach(i => {
          if (i.selected) {
            selectedSites.push(i.key);
          }
        });
      });
    });
    console.log(selectedSites);
    this.selectedSites = selectedSites;
    allParks.forEach(i => {
      if (i.selected) {
        this.currentPark = i.id;
      }
    });
  }
  @action.bound
  reload() {
    this.init();
  }

  // 监测面板
  @observable currentPmCode = "";
  @observable allConcernSiteData: Array<ConcernSiteData> = [];
  @observable allParkMapData: {
    parkId: string;
    parkName: string;
    parkPoints: Array<{
      longitude: string;
      latitude: string;
    }>;
    siteDatas: Array<ConcernSiteData>;
    factoryDatas: Array<{
      factoryId: string;
      factoryName: string;
      factoryPoints: any;
      averageValue: string;
      unit: string;
    }>;
  } = {
    parkId: "",
    parkName: "",
    parkPoints: [],
    siteDatas: [],
    factoryDatas: []
  };

  @action.bound
  setCurrentPmCode(currentPmCode: string) {
    this.currentPmCode = currentPmCode;
  }

  @action.bound
  async loadConcernSiteData(pmCode: string) {
    const result = await api.DeviceData.getConcernSiteData({ pmCode });
    const result1 = await api.DeviceData.getParkMapData({ pmCode });
    this.allConcernSiteData = result.data;
    this.allParkMapData = result1.data;
  }
  // 设置面板
  @observable boxDisplay = false;
  @action.bound
  toggleBox(value?: boolean) {
    this.boxDisplay = value ? value : !this.boxDisplay;
  }

  //厂区相关
  @observable currentPark = 0;
  @action.bound
  async selectFactory(factoryId) {
    this.currentPark = factoryId;
  }
  @action.bound
  async saveSelectedFactory() {
    await api.Other.setSelectedPark({ parkId: this.currentPark });
    notification.success({ message: "更新成功" });
    this.toggleBox();
    this.reload();
  }

  //站点相关
  @observable selectedSites: string[] = [];
  @action.bound
  async saveSelectedSites(siteIds: number[]) {
    await api.Other.addConcernSite({ parkId: this.currentPark, siteIds });
    notification.success({ message: "更新成功" });
    this.toggleBox();
    this.reload();
  }

  @action.bound
  draw() {
    for (let x in this.pointsc) {
      const pixel = this.map.pointToOverlayPixel(new BMap.Point(this.pointsc[x].position.lng, this.pointsc[x].position.lat));
      this.pointsc[x].mapPos.left = pixel.x - 15 + "px";
      this.pointsc[x].mapPos.top = pixel.y - 15 + "px";
    }
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
      let mapViewObj = this.map.getViewport(this.polygonPath, {});

      this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
    } else {
      this.draw();
    }
  }
}
