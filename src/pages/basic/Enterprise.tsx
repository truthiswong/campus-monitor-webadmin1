import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Badge, Divider, Card, Form, Input, Select, Button, Table, Breadcrumb } from "antd";
import { RouteComponentProps } from "react-router-dom";

const { Option } = Select;

type Props = RouteComponentProps<{}>
export const EnterprisePage = (props: Props) => {
  const rowSelection = useLocalStore(() => ({
    onChange: (selectedRowKeys:any, selectedRows:any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record:any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }))
  const columns = useLocalStore(() => ([
    {
      title: '企业代码',
      dataIndex: 'id',
    },
    {
      title: '企业名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: () => {
        return <Badge status="processing" text="正常" />
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text:any, record:any) => (
        <span>
          <a>删除</a>
          <Divider type="vertical" />
          <a onClick={() => props.history.push('add-enterprise')}>修改</a>
        </span>
      ),
    }
  ]))
  const data = useLocalStore(() => ([
    {
      key: '1',
      id: 'TradeCode21',
      desc: '这是一段描述，关于这个应用的描述',
      name: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
    {
      key: '2',
      id: 'TradeCode21',
      desc: '这是一段描述，关于这个应用的描述',
      name: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
    {
      key: '3',
      id: 'TradeCode21',
      desc: '这是一段描述，关于这个应用的描述',
      name: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
    {
      key: '4',
      id: 'TradeCode21',
      desc: '这是一段描述，关于这个应用的描述',
      name: '园区1',
      status: '正常',
      createTime: '2019-02-21',
    },
  ]))
  
  const goPage = ()=> {
    console.log('submit click')
  }
  
  return useObserver(() => <div>
    <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>基础信息</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">企业管理</a>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <Card>
      <div>
        <Form layout="inline" onSubmit={()=> console.log('aaa')}>
        <Form.Item  label="规则编号">
        <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item  label="状态">
          <Select style={{ width: 150 }}>
            <Option value="86">status</Option>
            <Option value="87">status</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 5}} onClick={goPage}>
            重置
          </Button>
        </Form.Item>
      </Form>
      </div>

      <div style={{marginTop: 20, marginBottom: 10}}>
        <Button type="primary" onClick={() => props.history.push('add-enterprise')}>新建</Button>
        <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量删除</Button>
      </div>

      <div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    </Card>;
  </div>);
};
