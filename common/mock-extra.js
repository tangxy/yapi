/**
 * @author suxiaoxin
 * @info  mockJs 功能增强脚本
 */
var strRegex = /\${([a-zA-Z]+)\.?([a-zA-Z0-9_\.]*)\}/i;
var varSplit = '.';
var mockSplit = '|';
var Mock = require('mockjs');
Mock.Random.extend({
  timestamp: function () {
    var time = new Date().getTime() + '';
    return +time.substr(0, time.length - 3)
  },
  sid: function () {
    return this.guid().replace(/-/g, '');
  },
  pbcard: function () {
    let data = Mock.mock({
      'regexp': /^(10|30|35|37|4\d||5[0-6]|58|60|62|6[8-9]|84|8[7-8]|9[0-2]|9[4-6]|9[8-9])\d{14,17}$/
    });
    return data.regexp;
  },

  mobile: function () {
    let data = Mock.mock({
      'regexp': /^(13\d|(14[5-7])|(15([0-3]|[5-9]))|166|17(0|1|8])|18\d|19(8|9))\d{8}$/
    });
    return data.regexp;
  },
  phone: function () {
    let data = Mock.mock({
      'regexp': /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
    });
    return data.regexp;
  },
  autocard: function () {
    let data = Mock.mock({
      'regexp': /^([\u4EAC\u6D25\u6CAA\u6E1D\u5180\u8C6B\u4E91\u8FBD\u9ED1\u6E58\u7696\u9C81\u65B0\u82CF\u6D59\u8D63\u9102\u6842\u7518\u664B\u8499\u9655\u5409\u95FD\u8D35\u7CA4\u9752\u85CF\u5DDD\u5B81\u743CA-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[\u4EAC\u6D25\u6CAA\u6E1D\u5180\u8C6B\u4E91\u8FBD\u9ED1\u6E58\u7696\u9C81\u65B0\u82CF\u6D59\u8D63\u9102\u6842\u7518\u664B\u8499\u9655\u5409\u95FD\u8D35\u7CA4\u9752\u85CF\u5DDD\u5B81\u743CA-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9\u6302\u5B66\u8B66\u6E2F\u6FB3]{1})$/
    });
    return data.regexp;
  },
  qq: function () {
    let data = Mock.mock({
      'regexp': /^[1-9]\d{4,10}$/
    });
    return data.regexp;
  }
})

function mock(mockJSON, context) {
  context = context || {};
  var filtersMap = {
    regexp: handleRegexp
  };
  if (!mockJSON || typeof mockJSON !== 'object') {
    return mockJSON;
  }

  return parse(mockJSON);

  function parse(p, c) {
    if (!c) {
      c = Array.isArray(p) ? [] : {}
    }

    for (var i in p) {
      if (!p.hasOwnProperty(i)) {
        continue;
      }
      if (p[i] && typeof p[i] === 'object') {
        c[i] = (p[i].constructor === Array) ? [] : {};
        parse(p[i], c[i]);
      } else if (p[i] && typeof p[i] === 'string') {
        p[i] = handleStr(p[i]);
        var filters = i.split(mockSplit), newFilters = [].concat(filters);
        c[i] = p[i];
        if (filters.length > 1) {
          for (var f = 1, l = filters.length, index; f < l; f++) {
            filters[f] = filters[f].toLowerCase();
            if (filters[f] in filtersMap) {
              if ((index = newFilters.indexOf(filters[f])) !== -1) {
                newFilters.splice(index, 1);
              }
              delete c[i];
              c[newFilters.join(mockSplit)] = filtersMap[filters[f]].call(p, p[i]);
            }
          }
        }
      } else {
        c[i] = p[i];
      }
    }
    return c;
  }

  function handleRegexp(item) {
    return new RegExp(item);
  }

  function handleStr(str) {
    if (typeof str !== 'string' || str.indexOf('{') === -1 || str.indexOf('}') === -1 || str.indexOf('$') === -1) {
      return str;
    }

    let matchs = str.match(strRegex);
    if (matchs) {
      let name = matchs[1] + (matchs[2] ? '.' + matchs[2] : '');
      if (!name) return str;
      var names = name.split(varSplit);
      var data = context;

      if (typeof context[names[0]] === undefined) {
        return str;
      }
      names.forEach(function (n) {
        if (data === '') return '';
        if (n in data) {
          data = data[n];
        } else {
          data = '';
        }
      });
      return data;
    }
    return str;
  }
}

module.exports = mock;