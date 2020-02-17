const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class interfaceColData extends baseModel {
  getName() {
    return 'interface_col_data';
  }

  getSchema() {
    return {
      name: { type: String, required: true },
      uid: { type: Number, required: true },
      col_id: { type: Number, required: true },
      project_id: { type: Number, required: true },
      add_time: Number,
      up_time: Number,
      datas: { type: String }
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

  list(col_id, select) {
    select = select || '_id name uid col_id project_id add_time up_time, datas';
    return this.model
      .find({
        col_id: col_id
      })
      .select(select)
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByCollectionId(id) {
    return this.model.remove({
      col_id: id
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

}

module.exports = interfaceColData;
