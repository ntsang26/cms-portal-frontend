const helper = {
  getDeepKeys: (obj) => {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        var subkeys = getDeepKeys(obj[key]);
        keys = keys.concat(subkeys.map(function (subkey) {
          return key + "." + subkey;
        }));
      }
    }
    return keys;
  },
  flattenDeepObject: (array) => {
    let result = {}
    let arr = Object.entries(array)
    for (const item of arr) {
      const key = item[0], value = item[1]
      if (value && typeof value == 'object' && !Array.isArray(value)) {
        let rs = helper.flattenDeepObject(value)
        rs = Object.entries(rs)
        for (const rsItem of rs) {
          result[`${key}.${rsItem[0]}`] = rsItem[1]
        }
      } else {
        result[key] = value
      }
    }
    return result
  }

}

export default helper