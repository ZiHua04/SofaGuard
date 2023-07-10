// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const OSS = require('ali-oss');

// 配置阿里云 OSS 的访问信息
const client = new OSS({
  region: 'oss-cn-chengdu',
  accessKeyId: 'LTAI5t8X69Abk5Ft6sP4SuV9',
  accessKeySecret: 'FXXjRmWQvwcrRA1qbof9m3EbYdL7Pb',
  bucket: 'sofaguard'
});

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const objectName = 'dog.jpg '; // 替换为您存储在 OSS 中的图片对象名称

    // 生成图片的URL
    const result = await client.signatureUrl(objectName, {
      expires: 3600 // URL 的过期时间，单位为秒
    });

    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};
