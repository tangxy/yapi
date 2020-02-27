const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class interfaceColReport extends baseModel {
  getName() {
    return 'interface_col_report';
  }

  getSchema() {
    return {
      name: { type: String, required: true },
      uid: { type: Number, required: true },
      project_id: { type: Number, required: true },
      task_id: { type: String },
      runner: { type: String },
      col_id: { type: Number },
      data_idx: { type: Number },
      row_idx: { type: Number },
      variables: { type: String },
      test_result: { type: String, default: '200' },
      desc: String,
      add_time: Number,
      up_time: Number,
      index: {
        type: Number, default: 0
      },
      test_report: { type: String, default: '{}' },
      checkHttpCodeIs200: {
        type: Boolean,
        default: false
      },
      checkResponseSchema: {
        type: Boolean,
        default: false
      },
      checkResponseField: {
        name: {
          type: String,
          required: true,
          default: "code"
        },
        value: {
          type: String,
          required: true,
          default: "0"
        },
        enable: {
          type: Boolean,
          default: false
        }
      },
      checkScript: {
        content: {
          type: String
        },
        enable: {
          type: Boolean,
          default: false
        }
      }
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

  checkRepeat(name) {
    return this.model.countDocuments({
      name: name
    });
  }

  list(col_id) {
    return this.model
      .find({
        col_id: col_id
      })
      .select('task_id data_idx row_idx test_result runner name uid project_id col_id desc add_time up_time, index')
      .exec();
  }

  listCountByCol(col_id) {
    return this.model.countDocuments({
      col_id: col_id
    });
  }

  listWithPagingByCol(col_id, page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    return this.model
      .find({
        col_id: col_id
      })
      .select('task_id data_idx row_idx test_result runner name uid project_id col_id desc add_time up_time, index')
      .sort({ add_time: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }

  upColIndex(id, index) {
    return this.model.update(
      {
        _id: id
      },
      {
        index: index
      }
    );
  }
}

module.exports = interfaceColReport;
