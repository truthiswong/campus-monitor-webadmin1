import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { useStore } from "../../../../stores";
import { _ } from "../../../../utils/lodash";

export const SewageTableDynamic = () => {
  const {
    screen: { enterpriseScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    get SiteRuntimePmDate() {
      let datas = [] as any;
      enterpriseScreenMap.SiteRuntimePmDate.forEach(site => {
        site.pmInfos.forEach(i => {
          if (i.pmType == 2) {
            datas.push({ ...i, siteName: site.siteName });
          }
        });
      });
      return _.chunk<any>(datas, 6);
    }
  }));

  return useObserver(() => (
    <div className="topRight screenTable flex-1">
      <div className="tableTitle text-center">污水排放情况（实时）</div>
      <div className="box">
        <div className="tabTitle">
          <div>站点名称</div>
          <div>检测物质</div>
          <div>监测数值</div>
          <div>限值</div>
          <div>超标率</div>
        </div>
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={store.SiteRuntimePmDate.length}>
          <Slider>
            {store.SiteRuntimePmDate.map((site, index) => {
              return (
                <Slide index={index}>
                  {site.map(item => {
                    if (item.pmType !== 2) return;
                    return (
                      <div className="listItem tabTitle">
                        <div>{item.siteName}</div>
                        <div>{item.pmName}</div>
                        <div>{item.collectValue + item.unit}</div>
                        <div>{item.limit}</div>
                        <div>{item.overRate}</div>
                      </div>
                    );
                  })}
                </Slide>
              );
            })}
          </Slider>
          <DotGroup className="text-center">
            {store.SiteRuntimePmDate.map((site, index) => {
              return <Dot slide={index} className="text-white sliderDotButton" children="" />;
            })}
          </DotGroup>
        </CarouselProvider>
      </div>
    </div>
  ));
};
