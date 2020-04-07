/**
 * PreflightReport.jsx
 *
 * Usage:
 * import PreflightReport from 'components/common/PreflightReport';
 ****
  <PreflightReport
    visible={this.state.sfPopBoxPreflightReportVisible}
    jobData={this.state.sfJobData}
    data={this.state.preflightReportData}
    closeBox={this.sfClosePopBoxPreflightReport}
    fileName={this.state.orderItemFileNameCopy}
    type={"buyer"}
    confirmPrint={this.confirmPrintFromPreflightReport}
    uploadAgain={this.uploadAgainFromPreflightReport}
  >
  </PreflightReport>
 ****
 * visible: a boolean which controls the visibility of the component;
 * data: an object which represents the preflight report data;
 * closeBox: a function which close the component;
 * fileName: a string which represents the file name;
 * type: a string represents where the call comes from; ["buyer", "seller"]
 * confirmPrint: a function which try to confirm print.
 * uploadAgain: a function which try to upload file again.
 */

import React, { Fragment } from 'react';
import { Modal } from 'antd';
import lang from "assets/js/language/config";
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import $ from 'jquery';
import Handling from "components/common/Handling";

import './style/preflightreport.scss';

const gProductTypeList = {
  "plano": "PLANO",
  "folded": "FOLDED",
  "bound": "BOUND"
};
const gDefaultSizeUnit = "mm";
const gRGBLabOkValueObj = {
  "cn": "不含RGB/Lab"
};
const gRGBLabErrorValueObj = {
  "cn": "含RGB/Lab"
};
const preflightKeyList = ["size", "color", "pages", "font", "imgRuleContone", "imgRuleBinary", "colorSpaceAction"];
const preflightKeyWarnErrorList = ["InvalidSize", "InvalidNumberOfSpotColors", "InvalidNumberOfPages", "FontPreflightRemark", "ImagePreflightRemarkCONTONE", "ImagePreflightRemarkBINARY", "ColorSpacePreflightRemark"];
const preflightValueListObj = {
  "cn": ["尺寸", "颜色", "页数", "字体", "灰度/彩色图像分辨率", "二进制图形", "RGB/Lab"]
}
const preflightValueWarnErrorListObj = {
  "cn": ["成品尺寸不符", "颜色", "页数不符", "缺少字体", "灰度/彩色图像分辨率", "二进制图形", "文件含有RGB/Lab色域的内容"]
}
const gPass = "PASS";
const gWarning = "WARNING";
const gError = "ERROR";
const gCNStr = "cn";
const typeBuyer = "buyer";
const typeSeller = "seller";

class PreflightReport extends React.Component {
  constructor(props) {
    super(props);
    this.downloadPreflightReport = this.downloadPreflightReport.bind(this);
  }

  downloadPreflightReport() {
    let _this = this;
    var dom = document.querySelector(".ep-preflight-report-box");
    var domFake = $(dom).clone()[0];
    $(domFake).addClass("ep-preflight-report-box1");
    $(domFake).find(".ep-box-close").remove();
    $(domFake).find(".ep-box-btns").remove();
    document.body.appendChild(domFake);
    var opt = {
      useCORS: true,
      width: $(domFake).width(),
      height: $(domFake).height() + 200,  Magic number, well, trade off.
      windowWidth: $(domFake).width(),
      windowHeight: $(domFake).height()
    }
    var originScrollLeft = window.pageXoffset || document.documentElement.scrollLeft || document.body.scrollLeft;
    var originScrollTop = window.pageYoffset || document.documentElement.scrollTop || document.body.scrollTop;

     This is the final fix if you really need it.
     $(document).on("scroll", function() {
       if ((window.pageYoffset || document.documentElement.scrollTop || document.body.scrollTop) === 0) {
         if (_this.props.visible) {
           Handling.start();
           setTimeout(doRenderCanvas, 1000);
         }
         $(document).off("scroll");
       }
     });

     Magic happens here.
    window.scroll(0, 50);
    window.scroll(0, 0);
    Handling.start();
    setTimeout(doRenderCanvas, 1000);

    function doRenderCanvas()
    {
      html2canvas(domFake, opt).then((canvas) => {
         Magic happens here, back to original state.
        window.scroll(originScrollLeft, originScrollTop);
        document.body.removeChild(domFake);
        var dataUrl = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 297;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF("p", "mm");
        for (var position = 0; heightLeft >= 0; heightLeft -= pageHeight, position = heightLeft - imgHeight) {
          if (heightLeft < imgHeight) {
            doc.addPage();
          }
          doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        }
        Handling.stop();
        let reportDate = moment().format('YYYY-MM-DD');
        let suffix = ".pdf";
        doc.save(lang.common.preflightReport + "-" + reportDate + suffix);
      });
    }
  }

  render() {
    const {visible, data, closeBox, fileName, jobData, type, confirmPrint, uploadAgain} = this.props;
    if (visible) {
       console.log(jobData);
       console.log(data);
      let reportData = [];
      for (let i = 0, len = preflightKeyList.length; i < len; i++) {
        let arr = [];
        if (lang.common.lang === gCNStr) {
           Empty cell.
          arr.push("");
           Item name.
          arr.push(preflightValueListObj[lang.common.lang][i]);
           Expected value.
          arr.push("");
           Preflight value.
          arr.push("");
           Preflight result.
          arr.push([gPass, ""]);
           Description.
          arr.push("");
           Fill default values for expected value and actual value.
          switch (preflightKeyList[i]) {
            case "size":
              if (jobData.product.productType === gProductTypeList["folded"]) {
                arr[2] = jobData.product.openSize.width + " x " + jobData.product.openSize.height + " " + gDefaultSizeUnit;
                arr[3] = jobData.product.openSize.width + " x " + jobData.product.openSize.height + " " + gDefaultSizeUnit;
              } else {
                arr[2] = jobData.product.size.width + " x " + jobData.product.size.height + " " + gDefaultSizeUnit;
                arr[3] = jobData.product.size.width + " x " + jobData.product.size.height + " " + gDefaultSizeUnit;
              }
              break;
            case "color":
              if (jobData.product.productType === gProductTypeList["bound"]) {
                arr[2] = jobData.product.bodyColor;
                arr[3] = jobData.product.bodyColor;
              } else {
                arr[2] = jobData.product.frontColor;
                arr[3] = jobData.product.frontColor;
              }
              break;
            case "pages":
              arr[2] = jobData.product.numberOfPages;
              arr[3] = jobData.product.numberOfPages;
              break;
            case "font":
              break;
            case "imgRuleContone":
              arr[2] = jobData.preflightConfig.contoneImageWarningResolution;
              arr[3] = ">=" + jobData.preflightConfig.contoneImageWarningResolution;
              break;
            case "imgRuleBinary":
                arr[2] = jobData.preflightConfig.binaryImageWarningResolution;
                arr[3] = ">=" + jobData.preflightConfig.binaryImageWarningResolution;
                break;
            case "colorSpaceAction":
                arr[2] = gRGBLabOkValueObj[lang.common.lang];
                arr[3] = gRGBLabOkValueObj[lang.common.lang];
                break;
            default:
              break;
          }
           Fill error/warning values if specified value exists.
          let warnErrorList = data.ERROR.concat(data.WARNING);
          for (let j = 0, len1 = warnErrorList.length, firstMeet = true; j < len1; j++) {
            if (warnErrorList[j].type === preflightKeyWarnErrorList[i] || preflightKeyWarnErrorList[i] === warnErrorList[j].type + warnErrorList[j].imageType) {
              if (warnErrorList[j].status === gError) {
                arr[4] = [warnErrorList[j].status, lang.common[warnErrorList[j].status]];
                arr[2] = warnErrorList[j].expected;
                arr[3] = warnErrorList[j].actual;
              } else if (warnErrorList[j].status === gWarning) {
                arr[4] = [warnErrorList[j].status, lang.common[warnErrorList[j].status]];
                arr[2] = warnErrorList[j].expected;
                arr[3] = warnErrorList[j].actual;
              }
              if (preflightKeyWarnErrorList[i] !== "FontPreflightRemark") {
                if (preflightKeyWarnErrorList[i] === "ColorSpacePreflightRemark") {
                  arr[2] = gRGBLabOkValueObj[lang.common.lang];
                  arr[3] = gRGBLabErrorValueObj[lang.common.lang];
                } else if (preflightKeyWarnErrorList[i] === warnErrorList[j].type + warnErrorList[j].imageType) {
                  arr[2] = warnErrorList[j].thresholdResolution;
                  arr[3] = "<" + warnErrorList[j].thresholdResolution;
                }
                break;
              } else {
                if (firstMeet) {
                  firstMeet = false;
                  arr[5] = preflightValueWarnErrorListObj[lang.common.lang][i] + lang.common.colon + "\n";
                }
                arr[5] += lang.common.pages + lang.common.colon + warnErrorList[j].pages + lang.common.comma
                          + lang.common.font + lang.common.colon + warnErrorList[j].font + "\n";
                continue;
              }
            }
          }
           Preflight description.
          if (arr[4][0] !== gPass) {
            if (preflightKeyList[i] !== "font") {
              arr[5] = preflightValueWarnErrorListObj[lang.common.lang][i];
            }
          }
        }
        reportData.push(arr);
      }
      return (
        <Fragment>
          <Modal
            destroyOnClose
            centered
            closable={false}
            maskClosable={false}
            width={720}
            height={503}
            wrapClassName={"ep-preflight-report-pop-box"}
            footer={null}
            visible={visible}
            onCancel={closeBox}
          >
            <div className="ep-preflight-report-box">
              <div className="ml-text-center ep-box-header">
                <span>{lang.common.preflightReport}</span>
                <div className="ep-box-close" onClick={closeBox}></div>
              </div>
              <div className="ml-no-user-select ep-box-title-list">
                <div className="ml-left ep-box-title-name"><span className="ml-block ml-ellipsis" title={lang.common.preflightFile + lang.common.colon + fileName}>{lang.common.preflightFile + lang.common.colon + fileName}</span></div>
                <div className="ml-left ep-box-title-platform"><span className="ml-block">{lang.common.checkPlatform + lang.common.colon + lang.common.ppy}</span></div>
                <div className="ml-right ep-box-title-date"><span className="ml-block">{lang.common.preflightDate + lang.common.colon + moment().format('YYYY-MM-DD')}</span></div>
              </div>
              <div className="ep-box-table">
                <table>
                  <thead>
                    <tr>
                      <th className="ep-tbl-cell0"></th>
                      <th className="ep-tbl-cell1">{lang.common.preflightItem}</th>
                      <th className="ep-tbl-cell2">{lang.common.orderRequirementValue}</th>
                      <th className="ep-tbl-cell3">{lang.common.filePreflightValue}</th>
                      <th className="ep-tbl-cell4">{lang.common.preflightResult}</th>
                      <th className="ep-tbl-cell5">{lang.common.desc}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      reportData.map((tr, trIndex) => (
                        <tr key={trIndex}>
                          {
                            tr.map((td, tdIndex) => (
                              tdIndex === 4
                              ?
                              <td key={tdIndex} className={"ep-tbl-cell" + tdIndex + " ep-tbl-cell-" + td[0]}>
                                {
                                  td[1].length > 0
                                  ?
                                  td[1]
                                  :
                                  <div className="ep-tbl-cell-pass"></div>
                                }
                              </td>
                              :
                              <td key={tdIndex} className={"ep-tbl-cell" + tdIndex}><pre>{td}</pre></td>
                            ))
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="ml-block-center ep-box-split"></div>
              <div className="ep-box-btns">
                <div className="ml-no-user-select ml-pointer ml-left ml-block-i ep-btn ep-btn-download" onClick={this.downloadPreflightReport}>
                  <span className="ml-block">{lang.common.downloadReport}</span>
                </div>
                {
                  type === typeBuyer
                  ?
                  <Fragment>
                      <div className="ml-no-user-select ml-pointer ml-right ml-block-i ep-btn ep-btn-upload-again" onClick={uploadAgain}>
                        <span className="ml-block">{lang.user.fileUploadAgain}</span>
                      </div>
                      <div className="ml-no-user-select ml-pointer ml-right ml-block-i ep-btn ep-btn-confirm-print" onClick={confirmPrint}>
                        <span className="ml-block">{lang.user.fileUploadConfirm1}</span>
                      </div>
                  </Fragment>
                  :
                  null
                }
              </div>
            </div>
          </Modal>
        </Fragment>
      )
    } else {
      return (
        <Fragment></Fragment>
      )
    }
  }
}

export default PreflightReport;
