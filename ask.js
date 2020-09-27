module.exports = ({ projectName }) => [
  {
    type: 'input',
    default: projectName,
    message: '项目名称',
    name: 'projectName',
  },
  {
    name: 'description',
    type: 'input',
    default: '',
    message: '描述'
  },
  {
    name: 'author',
    type: 'input',
    default: '',
    message: '作者'
  },
  {
    name: 'license',
    type: 'list',
    default: '',
    choices: [
      { name: 'MIT', value: 'MIT' },
      { name: 'ISC', value: 'ISC' }
    ],
    message: '开源协议'
  },
  {
    name: 'registry',
    type: 'list',
    default: 'npm',
    choices: [
      { name: 'ali', value: 'https://registry.npm.alibaba-inc.com' },
      { name: 'npm', value: 'https://registry.npmjs.org' }
    ],
    message: '注册类型'
  },
]