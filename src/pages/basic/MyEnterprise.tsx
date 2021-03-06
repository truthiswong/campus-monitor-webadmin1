import React, { useEffect, useState } from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import { Tag, message, Cascader, Radio, Select, DatePicker, Input, Form, Icon, Spin, Card, Row, Col, Tree, Descriptions, Button, Table, Divider, InputNumber, Modal, Upload } from "antd";
import Search from "antd/lib/input/Search";
import { toJS } from "mobx";
import moment from "moment";
import { useStore } from "../../stores/index";
import { DrawBaiduMap } from "../../components/DrawBaiduMap";
import { globalConfig } from "../../config";

const { Option } = Select;
const { Column } = Table;

const deviceListColumns = [
  {
    title: "设备编号",
    dataIndex: "deviceCode",
    width: 300,
  },
  {
    title: "设备名称",
    dataIndex: "deviceName",
    width: 300,
  },
  {
    title: "设备厂商",
    dataIndex: "manufacturerName",
    width: 400,
  },
  {
    title: "监测因子",
    dataIndex: "pmList",
    width: 500,
    render: (val) => {
      return val.map((v) => v.pmName).join(",");
    },
  },
  // {
  //   title: "设备类型",
  //   dataIndex: "deviceModelName",
  //   width: 300,
  // },
  // {
  //   title: "设备厂商",
  //   dataIndex: "manufacturerName",
  //   width: 300,
  // },
  // {
  //   title: "负责人",
  //   dataIndex: "chargerName",
  //   width: 200,
  // },
  // {
  //   title: "负责人电话",
  //   dataIndex: "phone",
  //   width: 300,
  // },
  // {
  //   title: "负责人邮箱",
  //   dataIndex: "email",
  //   width: 400,
  // },
];

export const MyEnterprisePage = Form.create()(
  observer(({ form }: any) => {
    const {
      base: { myEnterprise },
      map: { drawMap },
      config,
    } = useStore();

    const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue, validateFields, resetFields } = form;

    const { auth } = useStore();
    const {
      loading,
      saveFactory,
      parkList,
      factoryListInfo,
      factoryListPaginationChange,
      deleteFactory,
      setFactoryInfo,
      deviceSiteInfo,
      getDeviceSiteList,
      deviceSiteListInfo,
      deviceSiteListPaginationChange,
      belongChildTypeList,
      getDeviceSiteInfo,
      addDeviceSite,
      deleteDeviceSite,
      setDeviceSiteInfo,
      deviceListInfo,
      deviceListPaginationChange,
      getDeviceList,
      setDeviceInfo,
      deviceInfo,
      getDeviceInfo,
      treeData: oriTreeData,
      onTreeItemSelect,
      enterpriseInfo,
      factoryInfo,
      selectedEnterprise = {},
      doSubmitEnterpriseInfo,
      companyNatureType,
      industryType,
      dataSource,
      query,
      selectedRowKeys,
      total,
      onSelectChange,
      paginationChange,
      deleteEnterprise,
      handleSearchSubmit,
      handleSearchChange,
      handleSearchReset,
      resetSelectedRowKeys,
      addScope,
      setScope,
      updateMapPoints,
      scopeNameInput,
      longitudeInput,
      latitudeInput,
      factoryListSelectedRowKeys,
      onFactoryListSelectChange,
      deviceSiteListSelectedRowKeys,
      onDeviceSiteListSelectChange,
    } = myEnterprise;

    const transformList = (list) =>
      list.map((v) => ({
        ...v,
        icon: v.children.length > 0 ? null : v.level < 4 ? <Icon type="copy" /> : <Icon type="block" />,
        children: v.children.length > 0 ? transformList(v.children) : [],
      }));

    const treeData = transformList(oriTreeData);

    console.log(toJS(treeData));

    const {
      businessPeriodEnd,
      businessPeriodStart,
      businessScope,
      companyAddress,
      companyName,
      companyNature,
      companyNatureId,
      legalRepresentative,
      profession,
      professionId,
      registerCapital,
      registerDate,
      id,
    } = enterpriseInfo;

    const { factoryName, parkId, factoryAddress, contactPerson, contactPhone, contactPosition, email, scope } = factoryInfo;

    useEffect(() => {
      myEnterprise.getTree();
      myEnterprise.getCompanyNatureType();
      myEnterprise.getIndustryType();
      myEnterprise.getParkList();
      myEnterprise.getFactoryList();
      myEnterprise.getBelongChildType();
    }, []);

    const firstLevelClick = async (selectedKeys) => {
      if (!selectedKeys[0]) {
        return;
      }

      myEnterprise.loading = true;
      try {
        await onTreeItemSelect(selectedKeys);
        setEnterpriseInfoVisible(true);
        setFactoryInfoVisible(false);
        setDeviceSiteInfoVisible(false);

        setFieldsValue({ enterpriseInfoEditable: false });
        setEditFactoryModalVisible(false);
        setDeviceListModalVisible(false);
        setDeviceInfoVisible(false);
        setDeviceSiteInfo({});
      } catch {}
      myEnterprise.loading = false;
    };

    const secondLevelClick = async (selectedKeys) => {
      if (!selectedKeys[0]) {
        return;
      }

      myEnterprise.loading = true;
      let firstParentKey = "";
      treeData.some((item) => {
        if (item.children.some((v) => v.id === selectedKeys[0])) {
          firstParentKey = item.id;
          return true;
        }
      });

      await firstLevelClick([firstParentKey]);

      try {
        // await onTreeItemSelect([parentKey]);
        setEnterpriseInfoVisible(false);
        setFactoryInfoVisible(true);
        setDeviceSiteInfoVisible(false);
        setDeviceInfoVisible(false);

        setFieldsValue({ enterpriseInfoEditable: false });
        setDeviceListModalVisible(false);
        let info: any = {};
        factoryListInfo.data.some((v) => {
          if (v.id === selectedKeys[0]) {
            info = { ...v };
            return true;
          }
        });
        setFactoryInfo(info);
        setEditFactoryModalVisible(true);
        setDeviceListModalVisible(true);
        setDeviceSiteInfo({});
        await getDeviceSiteList();
      } catch {}
      myEnterprise.loading = false;
    };

    const thirdLevelClick = async (selectedKeys) => {
      if (!selectedKeys[0]) {
        return;
      }

      myEnterprise.loading = true;

      let secondParentKey = "";
      treeData.some((item) => {
        let tmp;
        if (
          item.children.some((v) => {
            tmp = v;
            return v.children.some((k) => k.id === selectedKeys[0]);
          })
        ) {
          secondParentKey = tmp.id;
          return true;
        }
      });
      let firstParentKey = "";
      treeData.some((item) => {
        if (item.children.some((v) => v.id === secondParentKey)) {
          firstParentKey = item.id;
          return true;
        }
      });

      await firstLevelClick([firstParentKey]);
      await secondLevelClick([secondParentKey]);

      try {
        // await onTreeItemSelect([parentKey]);
        setEnterpriseInfoVisible(false);
        setFactoryInfoVisible(false);
        setDeviceSiteInfoVisible(true);
        setDeviceInfoVisible(false);

        setFieldsValue({ enterpriseInfoEditable: false });
        let info: any = {};
        deviceSiteListInfo.data.some((v) => {
          if (v.id === selectedKeys[0]) {
            info = { ...v };
            return true;
          }
        });

        setDeviceSiteInfo(info);
        await getDeviceList();
        console.log(toJS(deviceSiteListInfo));
        console.log(toJS(selectedKeys));
        setEditFactoryModalVisible(false);
        setDeviceListModalVisible(true);
      } catch {}
      myEnterprise.loading = false;
    };

    const forthLevelClick = async (selectedKeys) => {
      if (!selectedKeys[0]) {
        return;
      }
      let thirdParentKey = "";
      treeData.some((item) => {
        let tmp;
        if (
          item.children.some((v) =>
            v.children.some((k: any) => {
              tmp = k;
              return k.children.some((l) => l.id === selectedRowKeys[0]);
            })
          )
        ) {
          thirdParentKey = tmp.id;
          return true;
        }
      });
      let secondParentKey = "";
      treeData.some((item) => {
        let tmp;
        if (
          item.children.some((v: any) => {
            tmp = v;
            return v.children.some((k) => k.id === thirdParentKey);
          })
        ) {
          secondParentKey = tmp.id;
          return true;
        }
      });
      let firstParentKey = "";
      treeData.some((item) => {
        if (item.children.some((v) => v.id === secondParentKey)) {
          firstParentKey = item.id;
          return true;
        }
      });
      myEnterprise.loading = true;

      await firstLevelClick([firstParentKey]);
      await secondLevelClick([secondParentKey]);
      await thirdLevelClick([thirdParentKey]);

      try {
        // await onTreeItemSelect([parentKey]);
        setEnterpriseInfoVisible(false);
        setFactoryInfoVisible(false);
        setDeviceSiteInfoVisible(false);
        setDeviceInfoVisible(true);

        setFieldsValue({ enterpriseInfoEditable: false });

        await getDeviceInfo(selectedKeys[0]);
        setEditFactoryModalVisible(false);
        setDeviceListModalVisible(false);
      } catch {}
      myEnterprise.loading = false;
    };

    const handleTreeItemSelect = async (selectedKeys, e) => {
      if (e.node.props.level === 1) {
        await firstLevelClick(selectedKeys);
      } else if (e.node.props.level === 2) {
        await secondLevelClick(selectedKeys);
      } else if (e.node.props.level === 3) {
        await thirdLevelClick(selectedKeys);
      } else if (e.node.props.level === 4) {
        await forthLevelClick(selectedKeys);
      }
      resetFields();
    };

    const submitEnterpriseInfo = (e) => {
      e.preventDefault();
      validateFields(async (err, values) => {
        if (err) {
          message.error("请补充所有字段信息");
          return;
        }
        values.professionId = values.professionId[1];

        myEnterprise.loading = true;
        try {
          await doSubmitEnterpriseInfo(values);
          setFieldsValue({ enterpriseInfoEditable: false });
        } catch {}
        myEnterprise.loading = false;
      });
    };

    const [enterpriseInfoVisible, setEnterpriseInfoVisible] = useState(true);
    const [factoryInfoVisible, setFactoryInfoVisible] = useState(false);
    const [deviceSiteInfoVisible, setDeviceSiteInfoVisible] = useState(false);
    const [deviceInfoVisible, setDeviceInfoVisible] = useState(false);

    const [editFactoryModalVisible, setEditFactoryModalVisible] = useState(false);
    const [editDeviceSiteModalVisible, setEditDeviceSiteModalVisible] = useState(false);
    const [deviceListModalVisible, setDeviceListModalVisible] = useState(false);

    const [factoryInfoEditable, setFactoryInfoEditable] = useState(false);

    const enterpriseInfoEditable = getFieldValue("enterpriseInfoEditable");

    const handleFactorySubmit = async (e) => {
      e.preventDefault();
      // if (scope && scope.length === 0) {
      //   message.error('请输入厂区范围');
      //   return;
      // }

      // const param = getFieldValue("factoryInfo");
      validateFields(["factoryInfo"], async (err, param) => {
        if (err) {
          message.error({ content: "请输入所有必填项", key: "factoryInfo", duration: 2 });
          return;
        }

        if (!scope || scope.length === 0) {
          message.error({ content: "请输入厂区范围", key: "scope.length", duration: 2 });
          return;
        }

        myEnterprise.loading = true;
        try {
          await saveFactory({ ...param.factoryInfo, scope: scope.map((v, i) => ({ ...v, scopeOrder: i })) });
          setFactoryInfoEditable(false);
          await myEnterprise.getTree();
          setFactoryInfoVisible(false);
          setEnterpriseInfoVisible(true);
        } catch {}
        myEnterprise.loading = false;
      });
    };

    let initialProfessionId: any = [];
    if (professionId) {
      industryType.some((k) =>
        k.children.some((v) => {
          if (v.id === professionId) {
            initialProfessionId = [k.id, v.id];
          }
        })
      );
    }

    const doDeleteFactory = (item) => {
      Modal.confirm({
        title: "删除确认",
        content: `确定删除厂区${item.factoryName}吗？`,
        async onOk() {
          try {
            await deleteFactory([item.id]);
            message.success("删除成功");
            await myEnterprise.getTree();
          } catch {
            message.error("删除失败");
          }
        },
      });
    };

    const handleDeviceSiteSubmit = () => {
      validateFields(["deviceSiteInfo"], async (err, { deviceSiteInfo }) => {
        if (err) {
          return;
        }

        await addDeviceSite(deviceSiteInfo);
        setEditDeviceSiteModalVisible(false);
        myEnterprise.deviceSiteInfo = {};
      });
    };

    const deviceSiteListcolumns = [
      {
        title: "厂区名称",
        dataIndex: "factoryName",
        width: 200,
      },
      {
        title: "站点名称",
        dataIndex: "siteName",
        width: 300,
      },
      {
        title: "监测分类",
        dataIndex: "belongChildType",
        width: 300,
        render: (text: any, record: any, index) => {
          console.log("belongChildTypeList", toJS(belongChildTypeList), text);
          let val = "";
          belongChildTypeList.some((item) => {
            if (item.dictCode === text) {
              val = item.dictName;
              return true;
            }
          });
          return val;
        },
      },
      {
        title: "经度",
        dataIndex: "gpsX",
        width: 200,
      },
      {
        title: "纬度",
        dataIndex: "gpsY",
        width: 200,
      },
      {
        title: "操作",
        width: 100,
        render: (text: any, record: any, index: any) => {
          return (
            <a
              onClick={() => {
                Modal.confirm({
                  title: "删除确认",
                  content: `确定删除站点${record.siteName}吗？`,
                  async onOk() {
                    try {
                      await deleteDeviceSite([record.factorySiteId]);
                      message.success("删除成功");
                    } catch {
                      message.error("删除失败");
                    }
                  },
                });
              }}
            >
              删除
            </a>
          );
        },
      },
    ];

    const columns = [
      {
        title: "厂区名称",
        dataIndex: "factoryName",
        width: 200,
      },
      {
        title: "地址",
        dataIndex: "factoryAddress",
        width: 300,
      },
      {
        title: "所属园区",
        dataIndex: "parkName",
        width: 150,
      },
      {
        title: "联络人",
        dataIndex: "contactPerson",
        width: 100,
      },
      {
        title: "邮箱",
        dataIndex: "email",
        width: 200,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 200,
        render: (text: any, record: any, index) => (
          <Row style={{ textAlign: "center" }}>
            <a
              onClick={() => {
                setFactoryInfo(record);
                setFactoryInfoVisible(true);
                setFactoryInfoEditable(true);
                setEnterpriseInfoVisible(false);
                setDeviceSiteInfoVisible(false);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a onClick={() => doDeleteFactory(record)}>删除</a>
          </Row>
        ),
      },
    ];

    const [treeExpandedKeys, setTreeExpandedKeys] = useState([]);

    const onTreeSearch = async (value) => {
      await myEnterprise.getTree(value);
      const expandedKeys: any = [];
      if (value) {
        const filterAdd = (list) =>
          list.forEach((item) => {
            if (item.title.indexOf(value) > -1) {
              expandedKeys.push(item.key);
            }
            item.children && filterAdd(item.children);
          });

        filterAdd(toJS(treeData));
      }

      setTreeExpandedKeys(expandedKeys);
    };

    const deviceSiteListPagination = {
      current: deviceSiteListInfo.current,
      pageSize: deviceSiteListInfo.pageSize,
      total: deviceSiteListInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: deviceSiteListPaginationChange,
      onShowSizeChange: deviceSiteListPaginationChange,
    };

    const deviceListPagination = {
      current: deviceListInfo.current,
      pageSize: deviceListInfo.pageSize,
      total: deviceListInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: deviceListPaginationChange,
      onShowSizeChange: deviceListPaginationChange,
    };

    const factoryListPagination = {
      current: factoryListInfo.current,
      pageSize: factoryListInfo.pageSize,
      total: factoryListInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => {
        return "共 " + total + " 条记录";
      },
      onChange: factoryListPaginationChange,
      onShowSizeChange: factoryListPaginationChange,
    };

    const factoryListRowSelection = {
      selectedRowKeys: factoryListSelectedRowKeys,
      onChange: onFactoryListSelectChange,
    };

    const onBatchDeleteFactoryList = () => {
      const selectedRows = toJS(factoryListSelectedRowKeys);
      if (selectedRows.length === 0) {
        message.warning("请勾选要删除的厂区");
        return;
      }

      const ids = selectedRows;

      Modal.confirm({
        title: "删除确认",
        content: `确定删除这${ids.length}个厂区吗？`,
        async onOk() {
          try {
            await deleteFactory([...ids]);
            message.success("删除成功");
            await myEnterprise.getTree();
          } catch {
            message.error("删除失败");
          }
        },
      });
    };

    const deviceSiteListRowSelection = {
      selectedRowKeys: deviceSiteListSelectedRowKeys,
      onChange: onDeviceSiteListSelectChange,
    };

    const onBatchDeleteDeviceSiteList = () => {
      const selectedRows = toJS(deviceSiteListSelectedRowKeys);
      if (selectedRows.length === 0) {
        message.warning("请勾选要删除的站点");
        return;
      }

      const ids = selectedRows;

      Modal.confirm({
        title: "删除确认",
        content: `确定删除这${ids.length}个站点吗？`,
        async onOk() {
          try {
            await deleteDeviceSite([...ids]);
            message.success("删除成功");
          } catch {
            message.error("删除失败");
          }
        },
      });
    };

    function beforeUpload(file) {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("只允许上传JPG/PNG文件!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片必须少于2MB!");
      }
      return isJpgOrPng && isLt2M;
    }

    const store = useLocalStore(() => ({
      imageUrl: null,
      uploadLogoLoading: false,
      getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
      },
      onUploadChange(info) {
        if (info.file.status === "uploading") {
          return (this.uploadLogoLoading = true);
        }

        if (info.file.status === "done") {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, (imageUrl) => {
            this.imageUrl = imageUrl;
            this.uploadLogoLoading = false;
          });
        }
      },
    }));

    return (
      <div className="myEnterprisePage">
        <Spin spinning={loading}>
          <Row gutter={10}>
            <Col span={6}>
              <Card bordered title="企业信息">
                <div>
                  <Search placeholder="请输入关键词" onSearch={onTreeSearch} style={{ width: 200 }} allowClear />
                </div>
                <div>
                  <Tree
                    showLine={true}
                    showIcon={true}
                    onSelect={handleTreeItemSelect}
                    switcherIcon={<Icon type="caret-down" />}
                    onExpand={(keys, e) => {
                      setTreeExpandedKeys(keys as any);
                      if (e.expanded) {
                        handleTreeItemSelect(keys.slice(-1), e);
                      }
                    }}
                    filterTreeNode={(node) => {
                      return (treeExpandedKeys as any).includes(node.props.eventKey);
                    }}
                    expandedKeys={treeExpandedKeys}
                    treeData={toJS(treeData)}
                    autoExpandParent={false}
                  />
                </div>
              </Card>
            </Col>
            <Col span={18}>
              {enterpriseInfoVisible && (
                <Card
                  bordered
                  title={
                    <Col>
                      {selectedEnterprise.title}
                      <span style={{ marginLeft: "6px", fontSize: "12px", color: "#999" }}>统一社会信用代码: {enterpriseInfo.companyCode}</span>
                    </Col>
                  }
                >
                  <div className="flex items-center">
                    <div className="mr-4">企业LOGO</div>
                    <div>
                      <Upload
                        name="logo"
                        listType="picture-card"
                        className="avatar-uploader"
                        headers={{ Authorization: `Bearer ${auth.token}` }}
                        data={{ companyId: selectedEnterprise.id }}
                        showUploadList={false}
                        action={`${globalConfig.apiEndpoint}/company/editCompanyLogo`}
                        beforeUpload={beforeUpload}
                        onChange={store.onUploadChange}
                      >
                        {store.imageUrl || enterpriseInfo.companyLogo ? (
                          <img src={store.imageUrl || enterpriseInfo.companyLogo} alt="avatar" style={{ width: "100%" }} />
                        ) : (
                          <div>
                            <Icon type={store.uploadLogoLoading ? "loading" : "plus"} />
                            <div className="ant-upload-text">Upload</div>
                          </div>
                        )}
                      </Upload>
                    </div>
                    <div style={{ fontSize: "10px", color: "#999" }}>建议上传尺寸32*32，透明背景的logo</div>
                  </div>
                  <Form onSubmit={submitEnterpriseInfo}>
                    <Card
                      bordered
                      size="small"
                      title="工商基本信息"
                      extra={
                        enterpriseInfoEditable ? (
                          <Row>
                            <Button icon="save" htmlType="submit" type="primary">
                              保存
                            </Button>
                            <Divider type="vertical" />
                            <Button onClick={() => resetFields()} icon="save">
                              取消
                            </Button>
                          </Row>
                        ) : (
                          <Button icon="edit" onClick={() => setFieldsValue({ enterpriseInfoEditable: true })} type="primary">
                            编辑
                          </Button>
                        )
                      }
                    >
                      {getFieldDecorator("enterpriseInfoEditable", { initialValue: false })(<Input style={{ display: "none" }} />)}
                      {getFieldDecorator("companyId", { initialValue: selectedEnterprise.id, rules: [{ required: false }] })(<Input style={{ display: "none" }} placeholder="" />)}
                      <Descriptions size="small" bordered>
                        <Descriptions.Item label="法人代表" span={1.5}>
                          {getFieldDecorator("legalRepresentative", { initialValue: legalRepresentative, rules: [{ required: true }] })(<Input disabled={!enterpriseInfoEditable} placeholder="" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="行业" span={1.5}>
                          {getFieldDecorator("professionId", { initialValue: initialProfessionId, rules: [{ required: true }] })(
                            <Cascader fieldNames={{ label: "label", value: "value", children: "children" }} disabled={!enterpriseInfoEditable} placeholder="" options={toJS(industryType)} />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="注册资本" span={1.5}>
                          <Row type="flex" justify="center">
                            <Col span={20}>
                              {getFieldDecorator("registerCapital", { initialValue: registerCapital, rules: [{ required: true }] })(
                                <InputNumber style={{ width: "100%" }} disabled={!enterpriseInfoEditable} placeholder="" />
                              )}
                            </Col>
                            <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              万
                            </Col>
                          </Row>
                        </Descriptions.Item>
                        <Descriptions.Item label="注册日期" span={1.5}>
                          {getFieldDecorator("registerDate", { initialValue: registerDate && moment(registerDate), rules: [{ required: true }] })(
                            <DatePicker allowClear={false} disabled={!enterpriseInfoEditable} placeholder="" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="公司性质" span={1.5}>
                          {getFieldDecorator("companyNatureId", { initialValue: companyNatureId, rules: [{ required: true }] })(
                            <Select disabled={!enterpriseInfoEditable} placeholder="">
                              {companyNatureType.map((item) => (
                                <Option key={item.id} value={item.id}>
                                  {item.dictName}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="经营期限" span={1.5}>
                          <Row type="flex" justify="center" gutter={6}>
                            <Col span={10}>
                              {getFieldDecorator("businessPeriodStart", { initialValue: businessPeriodStart && moment(businessPeriodStart), rules: [{ required: true }] })(
                                <DatePicker allowClear={false} disabled={!enterpriseInfoEditable} placeholder="" />
                              )}
                            </Col>
                            <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              至
                            </Col>
                            <Col span={10}>
                              {getFieldDecorator("businessPeriodEnd", { initialValue: businessPeriodEnd && moment(businessPeriodEnd), rules: [{ required: false }] })(
                                <DatePicker allowClear={true} disabled={!enterpriseInfoEditable} placeholder="" />
                              )}
                            </Col>
                          </Row>
                        </Descriptions.Item>
                        <Descriptions.Item label="所在地" span={3}>
                          {getFieldDecorator("companyAddress", { initialValue: companyAddress, rules: [{ required: false }] })(<Input disabled={!enterpriseInfoEditable} placeholder="" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="经营范围" span={3}>
                          {getFieldDecorator("businessScope", { initialValue: businessScope, rules: [{ required: false }] })(<Input.TextArea disabled={!enterpriseInfoEditable} placeholder="" />)}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Form>
                  <Divider />
                  <Card
                    bordered
                    size="small"
                    title="厂区信息"
                    extra={
                      <Row>
                        <Button onClick={onBatchDeleteFactoryList} icon="delete">
                          批量删除
                        </Button>
                        <Divider type="vertical" />
                        <Button
                          icon="file-add"
                          onClick={() => {
                            setFactoryInfoVisible(true);
                            setEnterpriseInfoVisible(false);
                            setDeviceSiteInfoVisible(false);
                            setFactoryInfoEditable(true);
                            setFactoryInfo({});
                          }}
                          type="primary"
                        >
                          添加厂区
                        </Button>
                      </Row>
                    }
                  >
                    <Table
                      size="small"
                      rowKey="id"
                      rowSelection={factoryListRowSelection}
                      pagination={factoryListPagination}
                      bordered
                      columns={columns}
                      dataSource={toJS(factoryListInfo.data) || []}
                    />
                  </Card>
                </Card>
              )}

              {factoryInfoVisible && (
                <Form layout="horizontal">
                  <Card
                    bordered
                    title={factoryInfo.id ? factoryInfo.factoryName : "新增厂区"}
                    extra={
                      factoryInfoEditable ? (
                        <Row>
                          <Button type="primary" onClick={handleFactorySubmit}>
                            保存
                          </Button>
                          <Divider type="vertical" />
                          <Button
                            onClick={() => {
                              setFactoryInfoEditable(false);
                              setEnterpriseInfoVisible(true);
                              setFactoryInfoVisible(false);
                            }}
                          >
                            取消
                          </Button>
                        </Row>
                      ) : (
                        <Row>
                          <Button onClick={() => setFactoryInfoEditable(true)}>编辑</Button>
                        </Row>
                      )
                    }
                  >
                    {getFieldDecorator("factoryInfo.id", { initialValue: factoryInfo.id, rules: [{ required: false }] })(<Input hidden placeholder="请输入厂区ID" />)}
                    {getFieldDecorator("factoryInfo.companyId", { initialValue: selectedEnterprise.id, rules: [{ required: false }] })(<Input hidden placeholder="请输入公司ID" />)}
                    <Card title="厂区信息" bordered size="small">
                      <Descriptions size="small" bordered>
                        <Descriptions.Item
                          label={
                            <Row>
                              厂区名称 <span style={{ color: "red" }}>*</span>
                            </Row>
                          }
                          span={1.5}
                        >
                          {getFieldDecorator("factoryInfo.factoryName", { initialValue: factoryInfo.factoryName, rules: [{ required: true, message: "请输入厂区名称" }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入厂区名称" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <Row>
                              请选择所属园区 <span style={{ color: "red" }}>*</span>
                            </Row>
                          }
                          span={1.5}
                        >
                          {getFieldDecorator("factoryInfo.parkId", { initialValue: factoryInfo.parkId, rules: [{ required: true, message: "请输入所属园区" }] })(
                            <Select disabled={!factoryInfoEditable} placeholder="请输入所属园区">
                              {parkList.map((item) => (
                                <Option value={item.id}>{item.parkName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <Row>
                              地址 <span style={{ color: "red" }}>*</span>
                            </Row>
                          }
                          span={1.5}
                        >
                          {getFieldDecorator("factoryInfo.factoryAddress", { initialValue: factoryInfo.factoryAddress, rules: [{ required: true, message: "请输入地址" }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入地址" />
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Divider />
                    <Card title="联络人信息" bordered size="small">
                      <Descriptions size="small" bordered>
                        <Descriptions.Item label="联络人" span={1.5}>
                          {getFieldDecorator("factoryInfo.contactPerson", { initialValue: factoryInfo.contactPerson, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入联络人" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="电话" span={1.5}>
                          {getFieldDecorator("factoryInfo.contactPhone", { initialValue: factoryInfo.contactPhone, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入电话" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="职位" span={1.5}>
                          {getFieldDecorator("factoryInfo.contactPosition", { initialValue: factoryInfo.contactPosition, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入职位" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="邮箱" span={1.5}>
                          {getFieldDecorator("factoryInfo.email", { initialValue: factoryInfo.email, rules: [{ required: false }] })(
                            <Input disabled={!factoryInfoEditable} placeholder="请输入邮箱" />
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Divider />
                    <Card title={<Row>厂区范围</Row>} bordered size="small">
                      {getFieldDecorator("scopeType", { initialValue: "location", rules: [{ required: false }] })(
                        <Radio.Group disabled={!factoryInfoEditable}>
                          <Radio value="map" onClick={(e) => drawMap.setPathsByScope(scope)}>
                            地图绘制
                          </Radio>
                          <Radio value="location">输入经纬度</Radio>
                        </Radio.Group>
                      )}
                      <Divider />

                      <Modal
                        title="地图绘制(请鼠标双击绘制地图区域)"
                        visible={getFieldValue("scopeType") === "map"}
                        onOk={() => {
                          setFieldsValue({ scopeType: "location" });
                          updateMapPoints();
                        }}
                        onCancel={() => setFieldsValue({ scopeType: "location" })}
                        okText="确认"
                        cancelText="取消"
                        width={800}
                      >
                        <div style={{ width: "100%", height: "400px" }}>{getFieldValue("scopeType") === "map" && <DrawBaiduMap />}</div>
                      </Modal>

                      <Table
                        pagination={false}
                        size="small"
                        bordered
                        dataSource={toJS(scope)}
                        footer={(_) => factoryInfoEditable && <Button onClick={addScope} size="small" shape="circle" icon="plus" />}
                      >
                        <Column
                          title="名称"
                          dataIndex="scopeName"
                          key="scopeName"
                          render={(scopeName, _, index) => <Input disabled={!factoryInfoEditable} size="small" onChange={(e) => scopeNameInput(e.target.value, index)} value={scopeName} />}
                        />
                        <Column
                          title="经度"
                          dataIndex="longitude"
                          key="longitude"
                          render={(longitude, _, index) => <Input disabled={!factoryInfoEditable} size="small" onChange={(e) => longitudeInput(e.target.value, index)} value={longitude} />}
                        />
                        <Column
                          title="纬度"
                          dataIndex="latitude"
                          key="latitude"
                          render={(latitude, _, index) => <Input disabled={!factoryInfoEditable} size="small" onChange={(e) => latitudeInput(e.target.value, index)} value={latitude} />}
                        />
                        <Column
                          title="操作"
                          dataIndex="latitude"
                          key="latitude"
                          width={50}
                          render={(latitude, _, index) => {
                            return (
                              <Row type="flex" justify="center">
                                <Button
                                  shape="circle"
                                  icon="minus"
                                  size="small"
                                  disabled={!factoryInfoEditable}
                                  onClick={() => {
                                    factoryInfo.scope = factoryInfo.scope.filter((_, i) => i !== index);
                                  }}
                                />
                              </Row>
                            );
                          }}
                        />
                      </Table>
                    </Card>
                    <Divider />

                    {!!factoryInfo.id && !factoryInfoEditable && (
                      <Card
                        bordered
                        size="small"
                        title="站点信息"
                        extra={
                          <Row>
                            <Button onClick={onBatchDeleteDeviceSiteList} icon="delete">
                              批量删除
                            </Button>
                            <Divider type="vertical" />
                            <Button
                              icon="file-add"
                              onClick={() => {
                                setEditDeviceSiteModalVisible(true);
                                resetFields();
                              }}
                              type="primary"
                            >
                              添加站点
                            </Button>
                          </Row>
                        }
                      >
                        <Table
                          size="small"
                          rowKey="factorySiteId"
                          rowSelection={deviceSiteListRowSelection}
                          pagination={deviceSiteListPagination}
                          bordered
                          columns={deviceSiteListcolumns}
                          dataSource={toJS(deviceSiteListInfo.data) || []}
                        />
                      </Card>
                    )}

                    <Modal
                      title=""
                      visible={editDeviceSiteModalVisible}
                      onOk={handleDeviceSiteSubmit}
                      onCancel={() => {
                        setEditDeviceSiteModalVisible(false);
                        myEnterprise.deviceSiteInfo = {};
                      }}
                      width={800}
                    >
                      {getFieldDecorator("deviceSiteInfo.id", { initialValue: deviceSiteInfo.id, rules: [{ required: false }] })(<Input hidden placeholder="请输入站点ID" />)}
                      <Descriptions title="站点信息" size="small" bordered>
                        <Descriptions.Item
                          label={
                            <Row>
                              厂区名称<span style={{ color: "red" }}>*</span>
                            </Row>
                          }
                          span={1.5}
                        >
                          {getFieldDecorator("deviceSiteInfo.factoryId", { initialValue: factoryInfo.id, rules: [{ required: false }] })(
                            <Select disabled style={{ width: "100%" }} placeholder="">
                              {factoryListInfo.data.map((item) => (
                                <Option value={item.id}>{item.factoryName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <Row>
                              站点编号<span style={{ color: "red" }}>*</span>
                            </Row>
                          }
                          span={1.5}
                        >
                          {getFieldDecorator("deviceSiteInfo.siteCode", { initialValue: deviceSiteInfo.siteCode, rules: [{ required: false }] })(
                            <Input.Search enterButton onSearch={getDeviceSiteInfo} placeholder="请输入站点编号" />
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="站点名称" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.siteName", { initialValue: deviceSiteInfo.siteName, rules: [{ required: false }] })(<Input disabled placeholder="请输入站点名称" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="监测类型" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.belongChildType", { initialValue: deviceSiteInfo.belongChildType, rules: [{ required: false }] })(
                            <Select disabled style={{ width: "100%" }} placeholder="请输入监测类型">
                              {belongChildTypeList.map((item) => (
                                <Option value={item.dictCode}>{item.dictName}</Option>
                              ))}
                            </Select>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="经度" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.gpsX", { initialValue: deviceSiteInfo.gpsX, rules: [{ required: false }] })(<Input disabled placeholder="请输入经度" />)}
                        </Descriptions.Item>
                        <Descriptions.Item label="纬度" span={1.5}>
                          {getFieldDecorator("deviceSiteInfo.gpsY", { initialValue: deviceSiteInfo.gpsY, rules: [{ required: false }] })(<Input disabled placeholder="请输入纬度" />)}
                        </Descriptions.Item>
                      </Descriptions>
                    </Modal>
                  </Card>
                </Form>
              )}

              {deviceSiteInfoVisible && (
                <Row>
                  <Card bordered title={deviceSiteInfo.siteName}>
                    <Descriptions title="" size="small" bordered>
                      <Descriptions.Item label="厂区名称" span={1.5}>
                        {factoryListInfo.data.map((item) => {
                          if (item.factorySiteId === deviceSiteInfo.factoryId) {
                            return item.factoryName;
                          }
                          return null;
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="站点名称" span={1.5}>
                        {deviceSiteInfo.siteName}
                      </Descriptions.Item>
                      <Descriptions.Item label="监测类型" span={1.5}>
                        {belongChildTypeList.map((item) => {
                          if (item.dictCode === deviceSiteInfo.belongChildType) {
                            return item.dictName;
                          }
                          return null;
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="经度" span={1.5}>
                        {deviceSiteInfo.gpsX}
                      </Descriptions.Item>
                      <Descriptions.Item label="纬度" span={1.5}>
                        {deviceSiteInfo.gpsY}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                  <Divider />
                  <Card bordered title="设备信息">
                    <Table size="small" rowKey="key" pagination={deviceListPagination} bordered columns={deviceListColumns} dataSource={toJS(deviceListInfo.data) || []} />
                  </Card>
                </Row>
              )}

              {deviceInfoVisible && (
                <Row>
                  <Card bordered title={deviceInfo.deviceName}>
                    <Descriptions title="" size="small" bordered>
                      <Descriptions.Item label="设备编号" span={1.5}>
                        {deviceInfo.deviceCode}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备名称" span={1.5}>
                        {deviceInfo.deviceName}
                      </Descriptions.Item>
                      <Descriptions.Item label="出厂日期" span={1.5}>
                        {deviceInfo.productionDate && moment(deviceInfo.productionDate).format("YYYY-MM-DD")}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备特点" span={1.5}>
                        {deviceInfo.features}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备厂商" span={1.5}>
                        {deviceInfo.manufacturerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="设备型号" span={1.5}>
                        {deviceInfo.modelName}
                      </Descriptions.Item>
                      <Descriptions.Item label="监测因子" span={1.5}>
                        {deviceInfo.pmList && deviceInfo.pmList.map((item) => <Tag key={item.pmId}>{item.pmName}</Tag>)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Row>
              )}
            </Col>
          </Row>
        </Spin>
        <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "white", zIndex: 9999 }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
      </div>
    );
  })
);
