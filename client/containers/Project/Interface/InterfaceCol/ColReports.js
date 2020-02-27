
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Modal } from 'antd';

import ColReport from './ColReport.js'

class ColReports extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    dataCount: PropTypes.number,
    currentPageIdx: PropTypes.number,
    onShowSizeChange: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '测试数据',
        dataIndex: 'data_idx'
      },
      {
        title: '数据行',
        dataIndex: 'row_idx'
      },
      {
        title: '执行者',
        dataIndex: 'runner'
      },
      {
        title: '执行结果',
        dataIndex: 'test_result'
      },
      {
        title: '执行时间',
        dataIndex: 'add_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div className="editable-row-operations">
              <a onClick={() => this.viewReport(record)}>测试报告</a>
            </div>
          );
        }
      }
    ];
    this.state = {
      reportVisable: false
    }
    this.onShowPageChange = this.onShowPageChange.bind(this);
  }
  viewReport(key) {
    this.setState({
      reportVisable: true,
      project_id: key.project_id,
      id: key._id
    });
  }
  onShowPageChange(current) {
    if (this.props.onShowSizeChange) {
      this.props.onShowSizeChange(current);
    }
  }
  render() {
    return (
      <div>
        <Table bordered dataSource={this.props.dataSource} columns={this.columns} pagination={{
          simple: true,
          current: this.props.currentPageIdx,
          total: this.props.dataCount,
          onChange: this.onShowPageChange
        }} />
        {this.state.reportVisable ? (
          <Modal
            title="详细测试报告"
            visible={this.state.reportVisable}
            onCancel={() => this.setState({ reportVisable: false })}
            footer={null}
            className="addcatmodal"
            width="900px"
            style={{
              minHeight: '500px'
            }}
          >
            <ColReport
              onCancel={() => this.setState({ reportVisable: false })}
              project_id={this.state.project_id}
              id={this.state.id}
            />
          </Modal>)
          :
          ('')
        }
      </div>
    );
  }
}

export default ColReports;



