//调用说明：
//generateGroup([[{id:1,value:"红色"},{id:2,value:"蓝色"}],[{id:3,value:"XX"},{id:4,value:"XXS"}],[{id:5,value:"10m"},{id:6,value:"20m"}]]);

//循环方式组合
const GenerateGroup = (arr) => {
  //初始化结果为第一个数组
  var result= new Array();
  //字符串形式填充数组
  for(var i=0;i<arr[0].length;i++){
    result.push(JSON.stringify(arr[0][i]));
  }
  //从下标1开始遍历二维数组
  for(var i=1;i<arr.length;i++){
    //使用临时遍历替代结果数组长度(这样做是为了避免下面的循环陷入死循环)
    var size= result.length;
    //根据结果数组的长度进行循环次数,这个数组有多少个成员就要和下一个数组进行组合多少次
    for(var j=0;j<size;j++){
      //遍历要进行组合的数组
      for(var k=0;k<arr[i].length;k++){
        //把组合的字符串放入到结果数组最后一个成员中
        //这里使用下标0是因为当这个下标0组合完毕之后就没有用了，在下面我们要移除掉这个成员
        //组合下一个json字符串
        var temp= result[0]+","+JSON.stringify(arr[i][k]);
        result.push(temp);
      }
      //当第一个成员组合完毕，删除这第一个成员
      result.shift();
    }
  }
  //转换字符串为json对象
  for(var i=0;i<result.length;i++){
    result[i]= JSON.parse("["+result[i]+"]");
  }

  return result;
}

export default GenerateGroup;