import React, {Component} from 'react';

function test2(html) {
  let imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;// 匹配图片中的src
  let str = html;
  let arr = str.match(imgReg)  //筛选出所有的img
  let srcArr = [];
  for (let i = 0; i < arr.length; i++) {
    let src = arr[i].match(srcReg);
    // 获取图片地址
    srcArr.push(src[1])
  }
  return srcArr
}

function getImgSrc(str) {
  var imgReg = /<img.*?(?:>|\/>)/gi;
  //匹配src属性
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  var arr = str.match(imgReg);

  if (arr && arr.length > 0) {
    var imgUrlArr = [];
    for (var i = 0; i < arr.length; i++) {
      var src = arr[i].match(srcReg);
      console.log("src---", src);
      //获取图片地址
      if (src[1]) {
        // alert('已匹配的图片地址'+(i+1)+'：'+src[1]);
      }

      //当然你也可以替换src属性
      if (src[0]) {
        var t = src[0].replace(/src\=/gmi, "").replace(/\&amp\;/gmi, "&").replace(/\"/g, "");
        imgUrlArr.push(t)
      }
    }
    // console.log("imgUrlArr---", imgUrlArr);
    return imgUrlArr
  }
}

window.callCheckSex = function (html) {
  var ccc = getImgSrc(html)
  //alert("开始调用py鉴黄接口"+html)
};

window.$LAB = $LAB;

class Ueditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    }
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    let content = nextProps.defaultContent;
    this.setState({
      content
    });
  }


  componentDidMount() {
    $LAB
      .script("/js/ueditor/ueditor.config.js")
      .script("/js/ueditor/ueditor.all.js").wait(() => {
      let UE = window.UE;
      UE.delEditor("container");
      let ueditor = UE.getEditor("container", {
        autoHeightEnabled: false,
        autoFloatEnabled: true
      });

      // UE.getEditor('container').addListener("ready",  ()=> {
      //
      //   UE.getEditor('container').setContent(this.state.content);
      // });
      setTimeout(() => {
        if (this.state.content) {
          ueditor.setContent(this.state.content || "")
        }

      }, 1000)
    });
  }

  fn() {

  }

  render() {

    return (
      <div>
                <textarea className="ueditor-container" id="container" name="blog" type="text/plain">

                </textarea>
      </div>
    )
  }
}

export default Ueditor;