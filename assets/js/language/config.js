

import * as cn from "./cn/index.js";
import en from "./en/language.js";
let globalLanguage = "cn";
if(globalLanguage == "cn"){
    globalLanguage = cn;
}else(globalLanguage == "en"){
    globalLanguage = en;
}

export  default  globalLanguage;
