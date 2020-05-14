
function queryDb(collection, where, limit, skip, successCb, failCb) {
  const baseQuery = wx.cloud.database().collection(collection)
  let query1 = where ? baseQuery.where : baseQuery
  let query2 = limit ? query1.limit(limit) : query1
  let query3 = skip ? query2.skip(skip) : query2
  // .where({
  //   _openid: this.data.openid
  // })
  query3.get({
    success: res => {
      successCb(res)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('query failed：', err)
      failCb(err)
    }
  })
}

function add() {
  const db = wx.cloud.database()
  db.collection('counters').add({
    data: {
      count: 1
    },
    success: res => {
      // 在返回结果中会包含新创建的记录的 _id
      this.setData({
        counterId: res._id,
        count: 1
      })
      wx.showToast({
        title: '新增记录成功',
      })
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })
}

export default {
  queryDb
}