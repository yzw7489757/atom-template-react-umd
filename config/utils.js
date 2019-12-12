const path = require('path')
const resolve = dir => path.resolve(__dirname, '../', dir);

const { dependencies } = require('../package');

const excludes = [
  // "react-app-polyfill",
  // "react-dev-utils" 
]

const getVendors = () => Object.keys(dependencies).filter(item=> !excludes.includes(item)); // dll

module.exports = {
  resolve,
  getVendors
}