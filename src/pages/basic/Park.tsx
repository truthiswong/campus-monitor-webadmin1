import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Card, Form, Button, Input, Select, Table, Badge, Divider, Breadcrumb } from 'antd'
import { RouteChildrenProps } from "react-router";
import { Link } from "react-router-dom";

const { Option } = Select;
type Props = RouteChildrenProps<{}>


export const ParkPage = (props: Props) => {
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
      title: '园区编号',
      dataIndex: 'id',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '园区名称',
      dataIndex: 'name',
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
          <a onClick={() => props.history.push('add-park')}>修改</a>
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

 return useObserver(() => 
 <div>
    <div style={{minHeight: 50, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>基础信息</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="base/park">园区管理</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <Card>
      <div>
        <Form layout="inline" onSubmit={()=> console.log('aa')}>
        <Form.Item label="规则编号">
        <Input placeholder="请输入"
        />
        </Form.Item>
        <Form.Item label="状态">
          <Select style={{ width: 150 }}>
            <Option value="86">status</Option>
            <Option value="87">status</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 5}}>
            重置
          </Button>
        </Form.Item>
      </Form>
      </div>

      <div style={{marginTop: 20, marginBottom: 10}}>
        <Button type="primary" onClick={()=> props.history.push('add-park')}>新建</Button>
        <Button  style={{ marginLeft: 5, marginRight: 5 }}>批量操作</Button>
        <Button>...</Button>
      </div>

      <div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    </Card>;
  </div>);
};
