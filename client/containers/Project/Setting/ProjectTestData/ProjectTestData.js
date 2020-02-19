import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProjectTestData.scss';
import { Icon, Layout, Tooltip, message, Row, Popconfirm } from 'antd';
const { Content, Sider } = Layout;
import { connect } from 'react-redux';
import { updateEnv, getProject, getEnv } from '../../../../reducer/modules/project';
import { fetchCaseDataList, fetchCaseTestData } from '../../../../reducer/modules/interfaceCol';
import EasyDragSort from '../../../../components/EasyDragSort/EasyDragSort.js';
import EditableTable from './EditableTable.js';

@connect(
  state => {
    return {
      projectMsg: state.project.currProject,
      dataList: state.interfaceCol.dataList,
      testData: state.interfaceCol.testData
    };
  },
  {
    fetchCaseDataList,
    fetchCaseTestData,
    updateEnv,
    getProject,
    getEnv
  }
)
class ProjectTestData extends Component {
  static propTypes = {
    match: PropTypes.object,
    dataList: PropTypes.array,
    testData: PropTypes.object,
    fetchCaseDataList: PropTypes.func,
    fetchCaseTestData: PropTypes.func,
    onOk: PropTypes.func,
    updateEnv: PropTypes.func,
    getProject: PropTypes.func,
    getEnv: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      testData: {},
      columns: [],
      datas: [],
      _id: null,
      currentTestDataItem: {},
      delIcon: null,
      currentKey: -2
    };
  }

  initState(curdata, id) {
    let newValue = {};
    newValue['dataList'] = [].concat(curdata);
    newValue['_id'] = id;
    this.setState({
      ...this.state,
      ...newValue
    });
  }

  async componentWillMount() {
    this._isMounted = true;
    await this.props.fetchCaseDataList(this.props.match.params.id);
    this.initState(this.props.dataList, this.props.match.params.id)
    await this.handleClick(0, this.props.dataList[0]);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  async getTestDriveData(project_id, case_data_id) {
    try {
      await this.props.fetchCaseTestData(project_id, case_data_id);
      let columns = JSON.parse(this.props.testData.columns);
      let datas = JSON.parse(this.props.testData.datas);
      this.setState({
        columns: columns,
        datas: datas
      });

    } catch (e) {
      console.error(e);
    }
  }

  async handleClick(key, data) {
    await this.getTestDriveData(this.props.match.params.id, data._id);
    this.setState({
      currentTestDataItem: data,
      currentKey: key
    });
  }

  // 增加测试数据变量项
  addParams = (name, data) => {
    let newValue = {};
    data = { name: '新测试数据' };
    newValue[name] = [].concat(data, this.state[name]);
    this.setState(newValue);
    this.handleClick(0, data);
  };

  // 删除提示信息
  showConfirm(key, name) {
    let assignValue = this.delParams(key, name);
    this.onSave(assignValue);
  }

  // 删除测试数据变量项
  delParams = (key, name) => {
    let curValue = this.state.dataList;
    let newValue = {};
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    });
    this.setState(newValue);
    this.handleClick(0, newValue[name][0]);
    newValue['_id'] = this.state._id;
    return newValue;
  };

  enterItem = key => {
    this.setState({ delIcon: key });
  };

  // 保存设置
  async onSave(assignValue) {
    await this.props
      .updateEnv(assignValue)
      .then(res => {
        if (res.payload.data.errcode == 0) {
          this.props.getProject(this.props.match.params.id);
          this.props.getEnv(this.props.match.params.id);
          message.success('修改成功! ');
          if (this._isMounted) {
            this.setState({ ...assignValue });
          }
        }
      })
      .catch(() => {
        message.error('测试数据设置不成功 ');
      });
  }

  //  提交保存信息
  onSubmit = (value, index) => {
    let assignValue = {};
    assignValue['dataList'] = [].concat(this.state.dataList);
    assignValue['dataList'].splice(index, 1, value['dataList']);
    assignValue['_id'] = this.state._id;
    this.onSave(assignValue);
    this.props.onOk && this.props.onOk(assignValue['dataList'], index);
  };

  // 动态修改测试数据名称
  handleInputChange = (value, currentKey) => {
    let newValue = [].concat(this.state.dataList);
    newValue[currentKey].name = value || '新测试数据';
    this.setState({ dataList: newValue });
  };

  // 侧边栏拖拽
  handleDragMove = name => {
    return (data, from, to) => {
      let newValue = {
        [name]: data
      };
      this.setState(newValue);
      newValue['_id'] = this.state._id;
      this.handleClick(to, newValue[name][to]);
      this.onSave(newValue);
    };
  };

  render() {
    const { dataList, currentKey } = this.state;

    const dataSettingItems = dataList.map((item, index) => {
      return (
        <Row
          key={index}
          className={'menu-item ' + (index === currentKey ? 'menu-item-checked' : '')}
          onClick={() => this.handleClick(index, item)}
          onMouseEnter={() => this.enterItem(index)}
        >
          <span className="data-icon-style">
            <span className="data-name" style={{ color: item.name === '新测试数据' && '#2395f1' }}>
              {item.name}
            </span>
            <Popconfirm
              title="您确认删除此测试数据?"
              onConfirm={e => {
                e.stopPropagation();
                this.showConfirm(index, 'dataList');
              }}
              okText="确定"
              cancelText="取消"
            >
              <Icon
                type="delete"
                className="interface-delete-icon"
                style={{
                  display: this.state.delIcon == index && dataList.length - 1 !== 0 ? 'block' : 'none'
                }}
              />
            </Popconfirm>
          </span>
        </Row>
      );
    });

    return (
      <div className="m-data-panel">
        <Layout className="project-data">
          <Sider width={195} style={{ background: '#fff' }}>
            <div style={{ height: '100%', borderRight: 0 }}>
              <Row className="first-menu-item menu-item">
                <div className="data-icon-style">
                  <h3>
                    测试数据列表&nbsp;<Tooltip placement="top" title="在这里添加项目的测试数据配置">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </h3>
                  <Tooltip title="添加测试数据">
                    <Icon type="plus" onClick={() => this.addParams('dataList')} />
                  </Tooltip>
                </div>
              </Row>
              <EasyDragSort data={() => dataList} onChange={this.handleDragMove('dataList')}>
                {dataSettingItems}
              </EasyDragSort>
            </div>
          </Sider>
          <Layout className="data-content">
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <EditableTable testDataItem={this.state.currentTestDataItem}
                dataSource={this.state.datas}
                columns={this.state.columns}
                onSubmit={e => this.onSubmit(e, currentKey)}
                handleNameInput={e => this.handleInputChange(e, currentKey)} />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default ProjectTestData;
