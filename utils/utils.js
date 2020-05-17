var navList = [
    {
        lable: '全部',
        value: ''
    },
    {
        lable: '信息',
        value: 'info'
    },
    {
        lable: '搭车',
        value: 'carpool'
    },
    {
        lable: '租房',
        value: 'house'
    },
    {
        lable: '交易',
        value: 'trade'
    }
]

// 不包括全部
function getLabels(){
    var tempArr = []
    for(var i in navList){
        if(navList[i].value){
            tempArr.push(navList[i].lable)
        }
    }
    return tempArr
}

// 不包括全部
function getValues(){
    var tempArr = []
    for(var i in navList){
        if(navList[i].value){
            tempArr.push(navList[i].value)
        }
    }
    return tempArr
}

function getValueByLable(lable) {
    for(var i in navList){
        if (navList[i].lable == lable) {
            return navList[i].value
        }
    }
    return null
}

// 不包括全部
function getValueByIndex(index) {
    let tempArr = getValues()
    if (index < tempArr.length && index >= 0) {
        return tempArr[index]
        } else {
            return null
        }
}

module.exports = {
    navList,
    getLabels,
    getValueByLable,
    getValueByIndex
}