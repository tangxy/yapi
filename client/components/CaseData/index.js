// 测试集合中的测试数据选择

import React from 'react';
import PropTypes from 'prop-types';
import { Select, Collapse, Icon, Tooltip } from 'antd';
const Option = Select.Option;
const Panel = Collapse.Panel;
import './index.scss';

export default class CaseData extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    dataValue: PropTypes.number,
    dataList: PropTypes.array,
    currDataChange: PropTypes.func,
    changeClose: PropTypes.func,
    collapseKey: PropTypes.any
  };

  callback = key => {
    this.props.changeClose && this.props.changeClose(key);
  };

  render() {
    return (
      <Collapse
        style={{
          margin: 0,
          marginBottom: '16px'
        }}
        onChange={this.callback}
        // activeKey={this.state.activeKey}
        activeKey={this.props.collapseKey}
      >
        <Panel
          header={
            <span>
              {' '}
              选择测试驱动数据
              <Tooltip title="默认无测试驱动数据,驱动数据中的每一行作为执行变量，循环执行测试集合中的用例">
                {' '}
                <Icon type="question-circle-o" />{' '}
              </Tooltip>
            </span>
          }
          key="1"
        >
          <div className="case-data">
            {this.props.dataList.length > 0 && (
              <div>
                <Select
                  style={{
                    width: '100%'
                  }}
                  value={this.props.dataValue || '0'}
                  defaultValue="0"
                  onChange={val => this.props.currDataChange(val)}
                >
                  <Option key="0" value="0">
                    无测试驱动数据
                  </Option>
                  {this.props.dataList.map(item => {
                    return (<Option value={item._id} key={item._id}>
                      {item.name}
                    </Option>);
                  })}
                </Select>
              </div>
            )}
          </div>
        </Panel>
      </Collapse>
    );
  }
}
