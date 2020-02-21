
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './ProjectTestData.scss';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Form, Row, Col, Table, Divider, Button, Select, Input, Popconfirm, Modal } from 'antd';
import AddColumnForm from './AddColumnForm.js';
import DelColumnForm from './DelColumnForm.js';
import ImportTestDataForm from './ImportTestDataForm.js';
import ExportTestDataForm from './ExportTestDataForm.js';

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

// eslint-disable-next-line react/prop-types
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
    currTestData: PropTypes.object,
    colList: PropTypes.array,
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    handleNameInput: PropTypes.func,
    currentColletionId: PropTypes.number
  };
  constructor(props) {
    super(props);
    this.state = {
      data: props.dataSource,
      columns: props.columns,
      testDataName: props.currTestData.name,
      currentColletionId: props.currentColletionId,
      addColumnVisable: false,
      delColumnVisable: false,
      importCsvVisable: false,
      exportCsvVisable: false
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.dataSource,
      columns: nextProps.columns,
      testDataName: nextProps.currTestData.name,
      currentColletionId: nextProps.currentColletionId
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
  handlerApplyCollectionChange(val) {
    this.setState({ currentColletionId: val });
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
  ok(key) {
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

  handleDelete(key) {
    const newData = [...this.state.data];
    this.setState({ data: newData.filter(item => item.key !== key) });
  }
  handleAddColBtnClick = e => {
    e.preventDefault();
    this.setState({ addColumnVisable: true });
  };

  handleDelColBtnClick = e => {
    e.preventDefault();
    this.setState({ delColumnVisable: true });

  };

  handleAddColumn = (columnName) => {
    let { columns } = this.state;
    let newColumns = [].concat(columnName);
    newColumns = newColumns.concat(columns);
    this.setState({ addColumnVisable: false, columns: newColumns });
  }


  handleDelColumn = (columnNames) => {
    let deleteColumnNames = columnNames["checkbox-group"];
    let { columns, data } = this.state;
    for (let i = 0; i < deleteColumnNames.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (columns[j] === deleteColumnNames[i]) {
          columns.splice(j, 1);
          j--;
        }
      }
    }
    for (let i = 0; i < deleteColumnNames.length; i++) {
      for (let j = 0; j < data.length; j++) {
        delete data[j][deleteColumnNames[i]];
      }
    }
    this.setState({ delColumnVisable: false, columns: columns, data: data });
  }
  handleAddRowBtnClick = e => {
    e.preventDefault();
    const newData = [...this.state.data];
    const { columns } = this.state;
    let newRow = {};
    for (let i = 0; i < columns.length; i++) {
      let element = columns[i];
      if (element === 'key') {
        newRow[element] = uuidv4();
      } else {
        newRow[element] = "";
      }
    }
    let merged = newData.concat(newRow);
    this.setState({
      data: merged
    });
  };

  handleImportCsv = (csvdata) => {
    let { columns, data } = this.state;
    const parse = require('csv-parse/lib/es5/sync')
    const records = parse(csvdata, {
      columns: true,
      skip_empty_lines: true
    })
    let newData = [];
    for (let i = 0; i < records.length; i++) {
      let row = {};
      let csvrow = records[i];
      for (let j = 0; j < columns.length; j++) {
        if (columns[j] === 'key') {
          row[columns[j]] = uuidv4();
        } else {
          row[columns[j]] = csvrow[columns[j]] || '';
        }
      }
      newData.push(row);
    }
    let mergedData = data.concat(newData);
    this.setState({ importCsvVisable: false, data: mergedData });
  };

  handleImportCsvBtnClick = e => {
    e.preventDefault();
    this.setState({ importCsvVisable: true });
  };
  handleExportCSVBtnClick = e => {
    e.preventDefault();
    const { columns, data } = this.state;
    let rows = [];
    let headers = {};
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      if (column !== 'key') {
        headers[column] = column;
      }
    }
    rows.push(headers);

    for (let i = 0; i < data.length; i++) {
      let row = {};
      for (let j = 0; j < columns.length; j++) {
        let column = columns[j];
        if (column !== 'key') {
          row[column] = data[i][column];
        }
      }
      rows.push(row);
    }
    const stringify = require('csv-stringify/lib/es5/sync');
    let csvdata = stringify(rows);
    console.log(csvdata);
    this.setState({ exportCsvVisable: true, csvdata: csvdata });
  };
  handleNameChange(val) {
    this.setState({ testDataName: val });
    if (this.props.handleNameInput) {
      this.props.handleNameInput(val);
    }
  }
  handleSaveBtnClick = e => {
    e.preventDefault();
    const { columns, data, currentColletionId, testDataName } = this.state;
    const { currTestData } = this.props;
    let assignValue = {
      _id: currTestData._id,
      name: testDataName || currTestData.name,
      col_id: currentColletionId,
      columns: JSON.stringify(columns),
      datas: JSON.stringify(data)
    };
    if (this.props.onSubmit) {
      this.props.onSubmit(assignValue);
    }
  };
  render() {
    const { columns, data } = this.state;
    let columnsWithRender = [];
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      if (column === 'key') {
        continue;
      }
      let obj = {
        title: column,
        dataIndex: column,
        render: (text, record) => this.renderColumns(text, record, column)
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
                  <a onClick={() => this.ok(record.key)}>Ok</a>
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
    const { currTestData } = this.props;
    return (
      <div>
        <Row gutter={24}>
          <Col span={5}>
            <FormItem {...formItemLayout} required={false} label="名称">
              <Input value={currTestData.name}
                onChange={e => this.handleNameChange(e.target.value)}
                placeholder="请输入测试数据名称"
              />
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formItemLayout} required={false} label="范围">
              <Select value={this.props.currentColletionId || "0"} defaultValue="0" onChange={val => this.handlerApplyCollectionChange(val)}>
                <Option key="0" value="0">
                  项目所有集合
                </Option>
                {
                  this.props.colList.map(item => {
                    return (<Option value={item._id} key={item._id}>
                      {item.name}
                    </Option>);
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={14}>
            <div>
              <Button className="m-btn btn-save" icon="plus" type="primary" onClick={this.handleAddRowBtnClick}>添加行</Button>
              <Divider type="vertical" />
              <Button className="m-btn btn-save" icon="download" type="primary" onClick={this.handleImportCsvBtnClick}>导入csv</Button>
              <Divider type="vertical" />
              <Button className="m-btn btn-save" icon="export" type="primary" onClick={this.handleExportCSVBtnClick}>导出csv</Button>
              <Divider type="vertical" />
              <Button className="m-btn btn-save" icon="save" type="primary" onClick={this.handleSaveBtnClick}>保存</Button>
              <Divider type="vertical" />
              <Button className="m-btn btn-save" icon="pause" type="primary" onClick={this.handleAddColBtnClick}>添加列</Button>
              <Divider type="vertical" />
              <Button className="m-btn btn-save" icon="delete" type="danger" onClick={this.handleDelColBtnClick}>删除列</Button>
            </div>
          </Col>
        </Row>
        <Table bordered dataSource={data} columns={columnsWithRender} />
        {this.state.addColumnVisable ? (
          <Modal
            title="添加列"
            visible={this.state.addColumnVisable}
            onCancel={() => this.setState({ addColumnVisable: false })}
            footer={null}
            className="addcatmodal"
          >
            <AddColumnForm
              onCancel={() => this.setState({ addColumnVisable: false })}
              onSubmit={this.handleAddColumn}
            />
          </Modal>)
          :
          ('')
        }
        {this.state.delColumnVisable ? (
          <Modal
            title="删除列"
            visible={this.state.delColumnVisable}
            onCancel={() => this.setState({ delColumnVisable: false })}
            footer={null}
            className="addcatmodal"
          >
            <DelColumnForm
              onCancel={() => this.setState({ delColumnVisable: false })}
              onSubmit={this.handleDelColumn}
              columns={this.state.columns}
            />
          </Modal>)
          :
          ('')
        }
        {this.state.importCsvVisable ? (
          <Modal
            title="导入CSV数据"
            visible={this.state.importCsvVisable}
            onCancel={() => this.setState({ importCsvVisable: false })}
            footer={null}
            className="addcatmodal"
          >
            <ImportTestDataForm
              onCancel={() => this.setState({ importCsvVisable: false })}
              onSubmit={this.handleImportCsv}
            />
          </Modal>)
          :
          ('')
        }
        {this.state.exportCsvVisable ? (
          <Modal
            title="导出CSV数据"
            visible={this.state.exportCsvVisable}
            onCancel={() => this.setState({ exportCsvVisable: false })}
            footer={null}
            className="addcatmodal"
          >
            <ExportTestDataForm
              onCancel={() => this.setState({ exportCsvVisable: false })}
              csvdata={this.state.csvdata}
            />
          </Modal>)
          :
          ('')
        }

      </div>
    );
  }
}


export default EditableTable;



