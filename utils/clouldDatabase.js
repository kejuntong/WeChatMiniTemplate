const dbRef = wx.cloud.database()

function queryDb(collection, where, limit, skip, successCb, failCb) {
  const baseQuery = dbRef.collection(collection)
  let query1 = where ? baseQuery.where(where) : baseQuery
  let query2 = limit ? query1.limit(limit) : query1
  let query3 = skip ? query2.skip(skip) : query2
  // .where({
  //   _openid: this.data.openid
  // })
  // TODO: change order
  query3.orderBy('create_at', 'desc').get({
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

function insertDb(collection, data, successCb, failCb) {
  dbRef.collection(collection).add({
    // data: {
    //   count: 1
    // },
    data,
    success: res => {
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      successCb(res)
    },
    fail: err => {
      console.error('[数据库] [新增记录] 失败：', err)
      failCb(err)
    }
  })
}

export default {
  queryDb,
  insertDb
}