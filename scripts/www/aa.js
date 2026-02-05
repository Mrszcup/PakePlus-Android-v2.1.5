// index.js
const axios = require('axios');
const { crc32 } = require('crc'); // npm install axios crc

// 模拟文件名和内容
const fileName = '小王-1111'; // 实际文件名
const fileNameHex = Buffer.from(fileName).toString('hex'); // 转为 hex 编码

// 假设文件内容（实际中应从文件读取）
const fileContent = Buffer.from('Hello, this is a test file content.', 'utf-8');
const crc32Value = crc32(fileContent) >>> 0; // 确保为无符号整数
const fileSize = fileContent.length;

// 构建任务数据
const taskData = {
  name: fileNameHex,
  url: "http://192.168.2.25:3002/api/v1/pattern-delivery/download/1/998M%26S-",
  token: "123412",
  crc: crc32Value,
  size: fileSize,
  replace: 1
};

// 将 taskData 转为 JSON 字符串并进行 urlencode
let encodedTaskData = encodeURIComponent(JSON.stringify(taskData));

// 特殊处理：将 fileNameHex 的每个字节前加上 % （即 hex 字符串每两位插入 %）
// 例如: "74657374" -> "%74%65%73%74"
const hexEscapedFileName = fileNameHex.replace(/(.{2})/g, '%$1');
encodedTaskData = encodedTaskData.replace(fileNameHex, hexEscapedFileName);

// 发送请求
axios.post('http://192.168.2.24:8895/api/collections/rn_task/records', {
  machine_mac: '1E6AE601B36F0F2235281725167BE839', // 设备 SN
  status: 'pending',
  task_data: `url_decode(${encodedTaskData})`,
  task_type: 'FileDown',
  result_data: '{}'
})
.then(response => {
  console.log('任务提交成功:', response.status, response.data);
})
.catch(error => {
  console.error('任务提交失败:', error.response?.data || error.message);
});