
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './ProjectTestData.scss';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Divider, Button, Select, Input, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


const formItemLayout = {
  labelCol: {
    lg: { offset: 1, span: 3 },
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 19 },
    xs: { span: 24 },
    sm: { span: 14 }
  },
  className: 'form-item'
};
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);


class EditableTable extends Component {
  static propTypes = {
    testDataItem: PropTypes.object,
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    handleNameInput: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      data: props.dataSource,
      columns: props.columns
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.dataSource,
      columns: nextProps.columns
    });
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  render() {


    const { columns, data } = this.state;
    let columnsWithRender = [];
    for (let i = 0; i < columns.length; i++) {
      let element = columns[i];
      let obj = {
        title: element.title,
        dataIndex: element.dataIndex,
        render: (text, record) => this.renderColumns(text, record, element.key)
      };
      columnsWithRender = columnsWithRender.concat(obj);
    }
    columnsWithRender = columnsWithRender.concat({
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.key)}>Save</a>
                  <Divider type="vertical" />
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                : <a onClick={() => this.edit(record.key)}>Edit</a>
            }
            {
              <a>
                <Divider type="vertical" />
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                  <a>Delete</a>
                </Popconfirm>
              </a>

            }
          </div>
        );
      }
    });
    const { testDataItem } = this.props;
    return (
      <div>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem {...formItemLayout} required={false} label="名称">
              <Input value={testDataItem.name}
                onChange={e => this.props.handleNameInput(e.target.value)}
                placeholder="请输入测试数据名称"
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} required={false} label="范围">
              <Select value="0" defaultValue="0">
                <Option key="0" value="0">
                  项目所有集合
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <div>
              <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.handleAdd}>添加列</Button><Divider type="vertical" />
              <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.handleAdd}>添加行</Button><Divider type="vertical" />
              <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.handleAdd}>导入csv</Button><Divider type="vertical" />
              <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.handleAdd}>导出csv</Button><Divider type="vertical" />
              <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.handleAdd}>保存</Button><Divider type="vertical" />
            </div>
          </Col>
        </Row>
        <Table bordered dataSource={data} columns={columnsWithRender} />
      </div>
    );
  }
}


export default EditableTable;



