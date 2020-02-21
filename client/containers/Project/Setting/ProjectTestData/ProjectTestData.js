import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ProjectTestData.scss';
import { Icon, Layout, Tooltip, message, Row, Popconfirm } from 'antd';
import axios from 'axios';
const { Content, Sider } = Layout;
import { connect } from 'react-redux';
import { updateEnv, getProject, getEnv } from '../../../../reducer/modules/project';
import { fetchCaseDataList, fetchCaseTestData, fetchColSimpleList, updateCaseTestData } from '../../../../reducer/modules/interfaceCol';
import EditableTable from './EditableTable.js';

@connect(
  state => {
    return {
      projectMsg: state.project.currProject,
      dataList: state.interfaceCol.dataList,
      testData: state.interfaceCol.testData,
      colList: state.interfaceCol.colList
    };
  },
  {
    fetchCaseDataList,
    fetchCaseTestData,
    fetchColSimpleList,
    updateCaseTestData,
    updateEnv,
    getProject,
    getEnv
  }
)

class ProjectTestData extends Component {
  static propTypes = {
    match: PropTypes.object,
    dataList: PropTypes.array,
    colList: PropTypes.array,
    testData: PropTypes.object,
    fetchCaseDataList: PropTypes.func,
    fetchCaseTestData: PropTypes.func,
    fetchColSimpleList: PropTypes.func,
    updateCaseTestData: PropTypes.func,
    onOk: PropTypes.func,
    updateEnv: PropTypes.func,
    getProject: PropTypes.func,
    getEnv: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      colList: [],
      testData: {},
      columns: [],
      datas: [],
      _id: null,
      currentTestDataItem: {},
      delIcon: null,
      currentKey: -2
    };
  }

  initState(curdata, colList, id) {
    let newValue = {};
    newValue['dataList'] = [].concat(curdata);
    newValue['colList'] = [].concat(colList);
    newValue['_id'] = id;
    this.setState({
      ...this.state,
      ...newValue
    });
  }

  async componentWillMount() {
    this._isMounted = true;
    await this.props.fetchCaseDataList(this.props.match.params.id);
    await this.props.fetchColSimpleList(this.props.match.params.id);
    this.initState(this.props.dataList, this.props.colList, this.props.match.params.id)
    await this.handleClick(0, this.props.dataList[0]);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  async getTestDriveData(project_id, case_data_id) {
    try {
      if (case_data_id) {
        await this.props.fetchCaseTestData(project_id, case_data_id);
        let columns = JSON.parse(this.props.testData.columns);
        let datas = JSON.parse(this.props.testData.datas);
        this.setState({
          columns: columns,
          datas: datas,
          currentColletionId: this.props.testData.col_id
        });
      }
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
  addTestData = (name, data) => {
    console.log(data);
    let assignValue = {
      project_id: this.props.match.params.id,
      name: '新测试数据',
      col_id: 0,
      columns: '["key"]',
      datas: '[]'
    };
    this.onSave(assignValue, "添加成功");
    this.handleClick(0, assignValue);
  };

  // 删除提示信息
  showConfirm = async (key, currentTestDataItem) => {
    try {
      let res = await axios.post('/api/col/del_test_data', { case_data_id: currentTestDataItem._id, project_id: this.props.match.params.id });
      if (res.data.errcode === 0) {
        message.success('删除成功');
        this.reloadCaseDataList();
      }
    } catch (e) {
      message.error('测试数据删除不成功 ');
    }
  };

  // 删除测试数据变量项
  delTestData = (key, name) => {
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
  onSave = async (assignValue, msg) => {
    try {
      let res = await this.props.updateCaseTestData(assignValue);
      if (res.payload.data.errcode == 0) {
        message.success(msg);
        await this.reloadCaseDataList();
      }
    } catch (e) {
      message.error('测试数据设置不成功');
    }
  };
  reloadCaseDataList = async () => {
    await this.props.fetchCaseDataList(this.props.match.params.id);
    await this.props.fetchColSimpleList(this.props.match.params.id);
    this.initState(this.props.dataList, this.props.colList, this.props.match.params.id)
    this.handleClick(0, this.props.dataList[0]);
  };
  //  提交保存信息
  onSubmit = (value, index) => {
    let assignValue = value;
    assignValue['project_id'] = this.props.match.params.id;
    this.onSave(assignValue, "保存成功");
    this.props.onOk && this.props.onOk(assignValue['dataList'], index);
  };

  // 动态修改测试数据名称
  handleInputChange = (value, currentKey) => {
    let newValue = [].concat(this.state.dataList);
    newValue[currentKey].name = value || '新测试数据';
    this.setState({ dataList: newValue });
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
                this.showConfirm(index, item);
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
                    <Icon type="plus" onClick={() => this.addTestData('dataList')} />
                  </Tooltip>
                </div>
              </Row>
              <div>
                {dataSettingItems}
              </div>
            </div>
          </Sider>
          <Layout className="data-content">
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <EditableTable currTestData={this.state.currentTestDataItem}
                dataSource={this.state.datas}
                columns={this.state.columns}
                colList={this.state.colList}
                currentColletionId={this.state.currentColletionId}
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
