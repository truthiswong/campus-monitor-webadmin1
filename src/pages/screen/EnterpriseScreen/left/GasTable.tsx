import React, { useEffect } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { _ } from "../../../../utils/lodash";
import { utils } from "../../../../utils/index";

export const GasTable = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();

  const store = useLocalStore(() => ({
    get SiteRuntimePmDate() {
      let datas = [] as any;
      enterpriseScreenMap.SiteRuntimePmDate.forEach((site) => {
        if (!site.pmInfos) return;
        site.pmInfos.forEach((i) => {
          if (i.pmType == 1) {
            datas.push({ ...i, siteName: site.siteName });
          }
        });
      });
      return _.chunk<any>(datas, 10);
    },
  }));

  return useObserver(() => (
    <div className="topLeft screenTable flex-1">
      <div className="tableTitle text-center">气体排放情况（实时）</div>
      <div className="table-title-more" onClick={(e) => enterpriseScreenMap.toggleModal(1)}>
        详情 >
      </div>
      <div className="box">
        <div className="tabTitle">
          <div>站点名称</div>
          <div>检测物质</div>
          <div>监测数值</div>
          <div>限值</div>
          {false && <div>超标率</div>}
        </div>
        <CarouselProvider naturalSlideWidth={100} isPlaying naturalSlideHeight={100} totalSlides={store.SiteRuntimePmDate.length}>
          <Slider>
            {store.SiteRuntimePmDate.map((site, index) => {
              return (
                <Slide index={index}>
                  {site.map((item) => {
                    if (item.pmType !== 1) return;
                    return (
                      <div className={Number(item.limit) && Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? "listItem tabTitle warningColor" : " listItem tabTitle"}>
                        <div>{item.siteName}</div>
                        <div>{item.pmName}</div>
                        <div>
                          <span>{item.collectValue}</span>
                        </div>
                        <div>{item.limit}</div>
                        {false && <div>{item.overRate}</div>}
                      </div>
                    );
                  })}
                </Slide>
              );
            })}
          </Slider>
          <DotGroup className="text-center bottom-0">
            {store.SiteRuntimePmDate.map((site, index) => {
              return <Dot slide={index} className="text-white sliderDotButton" children="" />;
            })}
          </DotGroup>
        </CarouselProvider>
      </div>
    </div>
  ));
};
