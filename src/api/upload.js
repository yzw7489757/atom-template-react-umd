import request from 'utils/request';

export const uploadImg = data =>
  request({
    url: 'api/common/upload',
    method: 'post',
    data,
  });
