/**
 * BuriedPoint.jsx
 *
 * This is the unified entry for all the buried-points.
 * We can switch suppliers in this file.
 *
 * Usage:
 * import BuriedPoint from "components/common/BuriedPoint.jsx";
 * BuriedPoint.track(obj);
 *
 * obj: This is the function parameter(data structure) we(EP) used for buried-point.
 * data structure:
 * {
 *   // Must Have. This is the track name we used for tracking, please give english name.
 *   name: "name",
 *   // This is a normal object, pass whatever additional information(key-value pair) you think needed for tracking.
 *   options: {},
 *   // Used for type, for example, "identify".
 *   type: "type"
 * }
 * example:
 * {
 *   name: "跳转至图帮主",
 *   options: {},
 *   type: "identify"
 * }
 */

const BuriedPointFromZHUGEIO = {
  track: function(obj) {
    let resObj = this.dataConvert(obj);
    if (resObj) {
      if (window.epConfigJs && window.epConfigJs.buriedPoint.from === "zhugeio" && window.zhuge) {
        // Do it as soon as possible.
        doIt();
      } else {
        if (window.epConfigJs) {
          waitBP(doIt);
        } else {
          waitEpConfig(waitBP, doIt);
        }
      }
    } else {
      console.log("ERROR: Invalid track for ZHUGEIO.");
    }

    function doIt()
    {
      resObj.data["平台"] = "PC";
      if (resObj.type === "identify") {
        try {
          window.zhuge.identify(resObj.name, resObj.data);
        } catch (error) {
          console.log("ERROR:", error);
        }
      } else {
        try {
          window.zhuge.track(resObj.name, resObj.data);
        } catch (error) {
          console.log("ERROR:", error);
        }
      }
    }
  },
  /**
   * This function will convert the data from unified format(we defined) to format ZHUGEIO can recognize.
   *
   * return: [object | null]
   */
  dataConvert: function(obj) {
    let resObj = {
      data: {}
    };
    for (let key in obj) {
      if (key === "name") {
        resObj.name = obj[key];
      } else if (key === "options") {
        for (let key1 in obj[key]) {
          resObj.data[key1] = obj[key][key1];
        }
      } else if (key === "type") {
        if (obj[key] === "identify") {
          resObj.type = obj[key];
        }
      }
    }
    if ("name" in resObj) {
      return resObj;
    } else {
      return null;
    }
  }
}

// Work should be done after epConfigJs is available.
function waitEpConfig(cbWaitBP, cbWorker)
{
  var timer = setInterval(function() {
    if (window.epConfigJs) {
      clearInterval(timer);
      cbWaitBP(cbWorker);
    }
  }, 1000);
}

// Work should be done after specific buried point service is available.
function waitBP(cbWorker)
{
  if (window.epConfigJs.buriedPoint.from === "zhugeio" && window.zhuge) {
    // Do it as soon as possible.
    cbWorker();
  } else {
    if (window.epConfigJs.buriedPoint.from === "zhugeio") {
      var timer = setInterval(function() {
        if (window.zhuge) {
          clearInterval(timer);
          cbWorker();
        }
      }, 1000);
    } else {
      console.log("INFO: no buried point service available.");
    }
  }
}

// Use buried-point service from ZHUGEIO
const BuriedPoint = BuriedPointFromZHUGEIO;

export default BuriedPoint;
