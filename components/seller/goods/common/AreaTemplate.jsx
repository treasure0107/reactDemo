import React,{Fragment} from 'react';
import { Checkbox, Button, Icon } from 'antd';
import { CitySevenRegion } from "assets/js/city";


const CheckboxGroup = Checkbox.Group;

const defaultCheckedList = [];

class AreaTemplate extends React.Component {
    state = {
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        selectIndex: {
            frist: '',
            second: '',
            third: ''
        },
        chooseCheck:false,
        chooseIndeterminate:false,
        CitySevenRegion: CitySevenRegion
    };
    componentDidMount() {
        let _this = this;
        // document.onclick = function (e) {
        //     _this.setState({
        //         selectIndex: {
        //             frist: '',
        //             second: '',
        //             third: ''
        //         }
        //     })
        // }
       let cityData = JSON.parse(JSON.stringify(CitySevenRegion));
       this.props.listData&&(this.props.listData.length > 0 ? this.showValue(cityData, JSON.parse(this.props.listData)):this.showValue(cityData,false));
       this.props.noCheckList&&this.allDisabled(cityData)

     //  this.showValue(this.state.CitySevenRegion,this.a);
    }

    showModalType=()=>{
        this.setState({
            selectIndex: {
                frist: '',
                second: '',
                third: ''
            }
        })
    }

    //反选
    NoChecked(item, CityList) {
        if (item.checked) {
            if (CityList[0].children.filter((item, index) => {
                return item.checked && !item.indeterminate
            }).length == CityList[0].children.length) {
                CityList[0].checked = true;
                CityList[0].indeterminate = false;
            } else {
                CityList[0].indeterminate = true;
                CityList[0].checked = true;
            }
        } else {
            if (CityList[0].children.filter((item, index) => {
                return !item.checked & !item.indeterminate;
            }).length == CityList[0].children.length) {
                CityList[0].checked = false;
                CityList[0].indeterminate = false;
            } else {
                CityList[0].indeterminate = true;
                CityList[0].checked = false;
            }
        }
        if (CityList[1]) {
            this.NoChecked(CityList.shift(), CityList);
        }
    }

    getValue(CitySevenRegion) {
        let { checkedList } = this.state;
        if (CitySevenRegion) {
            
            for (let i = 0; i < CitySevenRegion.length; i++) {
                if (CitySevenRegion[i].checked && !CitySevenRegion[i].indeterminate&&!CitySevenRegion[i].disabled) {
                    if(CitySevenRegion[i].children){
                        if(CitySevenRegion[i].children.filter((item,index)=>{
                            return !item.disabled&&item.checked
                        }).length == CitySevenRegion[i].children.length){
                            checkedList.push({ value: CitySevenRegion[i].value, label: CitySevenRegion[i].label, r: CitySevenRegion[i].r });
                        }else{
                            this.getValue(CitySevenRegion[i].children);
                            // for(let b=0;b<CitySevenRegion[i].children.length;b++){
                            //     if(!CitySevenRegion[i].children[b].disabled){
                            //         checkedList.push({ id:CitySevenRegion[i].children[b].id, label: CitySevenRegion[i].children[b].label, RelationList: CitySevenRegion[i].children[b].RelationList });
                            //     }
                            // }
                        }
                    }else{
                        checkedList.push({ value: CitySevenRegion[i].value, label: CitySevenRegion[i].label, r: CitySevenRegion[i].r });
                    }                    
                } else if (CitySevenRegion[i].indeterminate) {
                    this.getValue(CitySevenRegion[i].children);
                }
            }
        }
        this.setState({
            checkedList: checkedList
        }, () => {
            
            this.props.onOk(checkedList, () => {
                this.setState({ checkedList: [] })
            });
        });
    }

    choseChildren(children,item){
        if(children){
            for (let i = 0; i < children.length; i++) {
                if(this.props.noCheckList.indexOf(children[i].value) != -1){
                    item.checked = false;
                    item.indeterminate = true;
                    continue
                }
                children[i].checked = true;
                if (children[i].children) {
                    this.choseChildren(children[i].children,children[i]);
                }
            }
        }
    }
    
//    } this.props.checkList
    showValueAuxiliary(CitySevenRegion, listChildren) {
        if (CitySevenRegion) {
            for (let d = 0; d < CitySevenRegion.length; d++) {
                if (listChildren) {
                    if (listChildren.v == CitySevenRegion[d].value) {
                        if(listChildren.c){
                            CitySevenRegion[d].indeterminate = true;
                            // 初始当 indeterminate =true时 选中都当时true 保证和oncheck方法判断是否disabled的逻辑相对应。若出现问题。再看
                            CitySevenRegion[d].checked = true;
                        }else{
                            CitySevenRegion[d].checked = true;
                            this.choseChildren(CitySevenRegion[d].children,CitySevenRegion[d]);
                        }
                        this.showValueAuxiliary(CitySevenRegion[d].children, listChildren.c);
                    }else{
                        if(this.props.noCheckList.indexOf(CitySevenRegion[d].value) != -1) CitySevenRegion[d].disabled = true
                    }
                } else {
                    CitySevenRegion[d].checked = true;
                    this.choseChildren(CitySevenRegion[d].children,CitySevenRegion[d]);
                }
                // if (this.props.noCheckList.indexOf(CitySevenRegion[d].label) != -1) {
                //     //  continue 
                //     if (listChildren) {
                //         if (listChildren.id == CitySevenRegion[d].id) {
                //             this.showValueAuxiliary(CitySevenRegion[d].children, listChildren.children);
                //         } else {
                //             if (this.props.noCheckList.indexOf(CitySevenRegion[d].label) != -1) CitySevenRegion[d].disabled = true
                //         }
                //     }
                // }else{
                //     if (listChildren) {
                //         if (listChildren.id == CitySevenRegion[d].id) {
                //             if(listChildren.children){
                //                 CitySevenRegion[d].indeterminate = true;
                //             }else{
                //                 CitySevenRegion[d].checked = true;
                //                 this.choseChildren(CitySevenRegion[d].children,CitySevenRegion[d]);
                //             }
                //             this.showValueAuxiliary(CitySevenRegion[d].children, listChildren.children);
                //         }else{
                //             if(this.props.noCheckList.indexOf(CitySevenRegion[d].label) != -1) CitySevenRegion[d].disabled = true
                //         }
                //     } else {
                //         CitySevenRegion[d].checked = true;
                //         this.choseChildren(CitySevenRegion[d].children,CitySevenRegion[d]);
                //     }
                // }

            }
            // CitySevenRegion[j].children[d].checked = true;
            // this.choseChildren(CitySevenRegion[j].children[d].children);
        }
    }

    allDisabled=(CitySevenRegion,fa)=>{
        if(CitySevenRegion){
            let count = 0;
            for(let i=0;i<CitySevenRegion.length;i++){
                if(this.props.noCheckList.indexOf(CitySevenRegion[i].value) != -1){
                    if(CitySevenRegion[i].checked||CitySevenRegion[i].indeterminate){
                        CitySevenRegion[i].disabled = false;
                    }else{
                        count = count + 1;
                        CitySevenRegion[i].disabled = true;
                    }   
                    this.setState({})
                    this.DisabledChild(CitySevenRegion[i].children)
                }
                if(fa){
                    this.allDisabled(CitySevenRegion[i].children,[CitySevenRegion[i],...fa])
                }else{
                    this.allDisabled(CitySevenRegion[i].children,[CitySevenRegion[i]])
                }
            }
            if(count == CitySevenRegion.length){
                if(fa&&fa[0]){
                    fa[0].disabled = true;
                    setTimeout(() => {
                        for(let i = 1;i<fa.length;i++){
                            this.disabledFa(fa[i])
                        }
                    }, 20);
                }
            }
        }
    }
    // 所有子元素不可点则父元素不可点
    disabledFa(fa) {
        if (fa.children.filter((item, index) => {
            return item.disabled == true
        }).length == fa.children.length) {
            fa.disabled = true;
            this.setState({})
        }
    }


    DisabledChild = (CitySevenRegion,fa) => {
        if (CitySevenRegion) {
            for (let i = 0; i < CitySevenRegion.length; i++) {
                if(this.props.checkList.indexOf(CitySevenRegion[i].value) == -1){
                    if(CitySevenRegion[i].checked||CitySevenRegion[i].indeterminate){
                        CitySevenRegion[i].disabled = false;
                    }else{
                        CitySevenRegion[i].disabled = true;
                    }   
                    this.setState({})
                    if(fa){
                        this.DisabledChild(CitySevenRegion[i].children,[CitySevenRegion[i],...fa])
                    }else{
                        this.DisabledChild(CitySevenRegion[i].children,[CitySevenRegion[i]])
                    }
                }
            }
        }
    }



    showValue(CitySevenRegion, list) {
        if (CitySevenRegion) {
            for (let i = 0; i < list.length; i++) {
                for(let j=0;j< CitySevenRegion.length;j++){
                    // if(this.props.noCheckList.indexOf(CitySevenRegion[j].label) != -1){
                    //     continue 
                    // }
                    if(CitySevenRegion[j].value == list[i].value){
                        CitySevenRegion[j].checked = true;
                        CitySevenRegion[j].disabled = false;
                        this.choseChildren(CitySevenRegion[j].children,CitySevenRegion[j]);
                    }
                    else if(list[i].r){
                        if(CitySevenRegion[j].value == list[i].r.v){
                            CitySevenRegion[j].indeterminate = true;
                            CitySevenRegion[j].checked = true;
                            CitySevenRegion[j].disabled = false;
                        }else{
                            if(this.props.noCheckList.indexOf(CitySevenRegion[j].children.value) != -1) CitySevenRegion[j].children.disabled = true
                        }
                        this.showValueAuxiliary(CitySevenRegion[j].children,list[i].r.c)
                    }else{
                      
                    }
                }
            }
          
        }
        this.setState({
            CitySevenRegion: CitySevenRegion
        })
    }
    

    // addId(CitySevenRegion){
    //     for(let i=0;i<CitySevenRegion.length;i++){
    //         if
    //     }
    // }


    onCheck(item, indexArray, nowIndex, isLast, isClick,fa) {
        let { CitySevenRegion } = this.state;
        // if(item.disabled){
        //     item.checked = false;
        // }else{
        //     item.checked = !item.checked;
        // }
        if(item.disabled){
            for(let i=0;i<fa.length;i++){
                if (fa[i].checked) {
                    fa[i].indeterminate = true
                }else{
                    fa[i].indeterminate = false
                }
            }
        }
        item.checked = !item.checked;
        // 反选         
        item.indeterminate = false;
        // 正选 indeterminate
        if (item.children) {
            nowIndex = nowIndex + 1;
            let CityList = CitySevenRegion[indexArray[0]];
            for (let i = 0; i < item.children.length; i++) {
                 item.children[i].checked = !item.checked; 
                if (i == item.children.length - 1) {
                    if (nowIndex == 1) {
                        CityList = item;
                    } else if (nowIndex == 2) {
                        this.NoChecked(item, [CityList]);
                        if (CityList.children[indexArray[1]]) {
                            CityList.children[indexArray[1]] = item;
                        }
                    } else if (nowIndex == 3) {
                        if (CityList.children[indexArray[1]] && CityList.children[indexArray[1]].children[indexArray[2]]) {
                            this.NoChecked(item, [CityList.children[indexArray[1]], CityList]);
                            CityList.children[indexArray[1]].children[indexArray[2]] = item;
                        }
                    }
                    else if (nowIndex == 4) {
                        if (CityList.children[indexArray[1]] && CityList.children[indexArray[1]].children[indexArray[2]]) {
                            this.NoChecked(item, [CityList.children[indexArray[1]].children[indexArray[2]], CityList.children[indexArray[1]], CityList]);
                            CityList.children[indexArray[1]].children[indexArray[2]].children[indexArray[3]] = item;
                        }
                    }
                    else if (nowIndex == 5) {
                        if (CityList.children[indexArray[1]] && CityList.children[indexArray[1]].children[indexArray[2]] && CityList.children[indexArray[1]].children[indexArray[2]].children[indexArray[3]] ) {
                            // this.NoChecked(item, [CityList.children[indexArray[1]].children[indexArray[2]].children[indexArray[3]], CityList.children[indexArray[1]].children[indexArray[2]], CityList]);
                            this.NoChecked(item, 
                                [CityList.children[indexArray[1]].children[indexArray[2]].children[indexArray[3]], 
                                CityList.children[indexArray[1]].children[indexArray[2]], 
                                CityList.children[indexArray[1]],
                                CityList]);
                            CityList.children[indexArray[1]].children[indexArray[2]].children[indexArray[3]].children[indexArray[4]] = item;
                        }
                    }
                    this.onCheck(item.children[i], indexArray, nowIndex, true,false,fa?[item,...fa]:[item]);
                } else {
                    this.onCheck(item.children[i], indexArray, nowIndex,false,false,fa?[item,...fa]:[item]);
                }
            }
        }
        else if (isLast) {
            this.setState({
                CitySevenRegion: CitySevenRegion,
                // checkedList:this.getValue(CitySevenRegion)
            })
        } else if (isClick) {
            let CityList = CitySevenRegion[indexArray[0]];
            this.NoChecked(item, [CityList.children[indexArray[1]].children[indexArray[2]].children[indexArray[3]], 
                CityList.children[indexArray[1]].children[indexArray[2]], 
                CityList.children[indexArray[1]],
                CityList]);
            this.setState({
                CitySevenRegion: CitySevenRegion
            });
        }else if(['台湾省','香港','澳门'].indexOf(item.label) != -1){
            let CityList = CitySevenRegion[indexArray[0]];
            this.NoChecked(item, [
                CityList.children[indexArray[1]].children[indexArray[2]], 
                CityList.children[indexArray[1]],
                CityList]);
            this.setState({
                CitySevenRegion: CitySevenRegion,
            })
        }
    }
    render() {
        let { selectIndex, CitySevenRegion,chooseIndeterminate,chooseCheck } = this.state;
        return (
            <div className='area-template-page'>
                {
                    CitySevenRegion.map((newItem, newIndex) => {
                        newItem.fatherId = [newItem.value];
                        return <div key={newIndex} style={{padding:24}}>
                            <Checkbox disabled={newItem.disabled} checked={newItem.checked&&!newItem.disabled?true:false} indeterminate={newItem.indeterminate&&!newItem.disabled?true:false} className='template-no-triger' style={{ flexShrink: 0 }} onChange={() => {
                                this.onCheck(newItem, [newIndex], 0)
                            }}>
                                {newItem.label}{newItem.checked == true && !newItem.indeterminate && ` (${
                                    newItem.children.filter((i,n)=>{
                                        return !i.disabled
                                    }).length})`}
                            </Checkbox>
                            {newItem.children.map((firstItem,firstIndex)=>{
                                  firstItem.r = {
                                    v:newItem.value,
                                    // label:newItem.label,
                                    c:{
                                        v: firstItem.value,
                                      //  label: firstItem.label,
                                    }
                                }
                                return <div key={firstIndex} style={{ display: 'flex',marginTop:15  }}>
                                <Checkbox disabled={firstItem.disabled} checked={firstItem.checked&&!firstItem.disabled?true:false} indeterminate={firstItem.indeterminate&&!firstItem.disabled?true:false} className='template-no-triger' style={{flexShrink:0}} onChange={() => {
                                    this.onCheck(firstItem, [newIndex,firstIndex], 1)
                                }}>
                                    {firstItem.label}{firstItem.checked==true&&!firstItem.indeterminate&&Array.isArray(firstItem.children)&&`(${firstItem.children.filter((i,n)=>{
                                        return !i.disabled
                                    }).length})`}
                                </Checkbox>
                                <div style={{ display: 'flex',flexWrap:'wrap',marginBottom:4 }}>
                                    {
                                        firstItem.children && firstItem.children.map((secondItem, secondIndex) => {
                                            secondItem.r = {
                                                v:newItem.value,
                                                // label:newItem.label,
                                                c:{
                                                    v: firstItem.value,
                                                   // label: firstItem.label,
                                                    c:{
                                                        v: secondItem.value,
                                                       // label: secondItem.label
                                                    }
                                                }
                                            };
                                            return <div className='frist-box opreat-box template-no-triger margin-left' key={secondIndex} onClick={(e) => {
                                                e.nativeEvent.stopImmediatePropagation();
                                            }}>
                                                <Checkbox disabled={secondItem.disabled} checked={secondItem.checked&&!secondItem.disabled?true:false} indeterminate={secondItem.indeterminate&&!secondItem.disabled?true:false} className='template-no-triger' value={secondItem.value} onChange={(e) => {
                                                    this.onCheck(secondItem, [newIndex,firstIndex, secondIndex], 2);
                                                    e.nativeEvent.stopImmediatePropagation();
                                                }}>
                                                    {secondItem.label}{secondItem.checked == true && !secondItem.indeterminate && Array.isArray(secondItem.children)&& `(${secondItem.children.filter((i, n) => {
                                                        return !i.disabled
                                                    }).length})`}
                                                </Checkbox>
    
                                                <div className='opreat template-no-triger' onClick={(e) => {
                                                    if (selectIndex.frist === firstIndex & selectIndex.second === secondIndex) {
                                                        selectIndex.frist = firstIndex;
                                                        selectIndex.second = '';
                                                        selectIndex.third = '';
                                                        this.setState({
                                                            selectIndex: selectIndex
                                                        })
                                                    } else {
                                                        selectIndex.frist = firstIndex;
                                                        selectIndex.second = secondIndex;
                                                        selectIndex.third = '';
                                                        this.setState({
                                                            selectIndex: selectIndex
                                                        })
                                                    }
                                                    e.nativeEvent.stopImmediatePropagation();
                                                }}>
                                                    <Icon type="right" />
                                                </div>
                                                {
                                                    (selectIndex.frist === firstIndex && selectIndex.second === secondIndex) ? <div className='second-box ant-popover-inner template-no-triger'>
                                                        <div className="ant-popover-arrow-top"></div>
                                                        {
                                                            secondItem.children && secondItem.children.map((thirdItem, thirdIndex) => {
                                                                thirdItem.r = {
                                                                    v:newItem.value,
                                                                   // label:newItem.label,
                                                                    c:{
                                                                        v: firstItem.value,
                                                                      //  label: firstItem.label,
                                                                        c: {
                                                                            v: secondItem.value,
                                                                            // label: secondItem.label,
                                                                            c: {
                                                                                v: thirdItem.value,
                                                                              //  label: thirdItem.label,
                                                                            }
                                                                        }
                                                                    }
                                                                };
                                                                // thirdItem.fatherId=[...secondItem.fatherId,secondItem.id]
                                                                return <div className='third-box' key={thirdIndex}>
                                                                    <div className='opreat-box'>
                                                                        <Checkbox disabled={thirdItem.disabled} indeterminate={thirdItem.indeterminate&&!thirdItem.disabled?true:false} checked={thirdItem.checked&&!thirdItem.disabled?true:false} className='template-no-triger' value={thirdItem.value} onChange={(e) => {
                                                                           this.onCheck(thirdItem, [newIndex,firstIndex, secondIndex, thirdIndex], 3);
                                                                            e.nativeEvent.stopImmediatePropagation();
                                                                        }}>
                                                                            {thirdItem.label}{thirdItem.checked == true && !thirdItem.indeterminate && Array.isArray(thirdItem.children)&&`(${thirdItem.children.filter((i, n) => {
                                                                                return !i.disabled
                                                                            }).length})`}
                                                                        </Checkbox>
                                                                        {
                                                                            thirdItem.children?  <div className='opreat opreat-box template-no-triger' onClick={(e) => {
                                                                                if (selectIndex.third === thirdIndex & selectIndex.second === secondIndex) {
                                                                                    selectIndex.second = secondIndex;
                                                                                    selectIndex.third = '';
                                                                                    this.setState({
                                                                                        selectIndex: selectIndex
                                                                                    })
                                                                                } else {
                                                                                    selectIndex.second = secondIndex;
                                                                                    selectIndex.third = thirdIndex;
                                                                                    this.setState({
                                                                                        selectIndex: selectIndex
                                                                                    })
                                                                                }
                                                                                e.nativeEvent.stopImmediatePropagation();
                                                                            }}>
                                                                                <Icon type="right" />
                                                                                {
                                                                                    (selectIndex.third === thirdIndex & selectIndex.second === secondIndex) ? <div className='fourth-box ant-popover-inner' onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        e.nativeEvent.stopImmediatePropagation();
                                                                                    }}>
                                                                                        <div className="ant-popover-arrow-right"></div>
                                                                                        {
                                                                                            thirdItem.children && thirdItem.children.map((item, index) => {
                                                                                                item.r = {
                                                                                                    v:newItem.value,
                                                                                                    // label:newItem.label,
                                                                                                    c:{
                                                                                                        v: firstItem.value,
                                                                                                       // label: firstItem.label,
                                                                                                        c: {
                                                                                                            v: secondItem.value,
                                                                                                           // label: secondItem.label,
                                                                                                            c: {
                                                                                                                v: thirdItem.value,
                                                                                                                // label: thirdItem.label,
                                                                                                                c: {
                                                                                                                    v: item.value,
                                                                                                                  //  label: item.label,
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                };
                                                                                                // item.fatherId=[...thirdItem.fatherId,thirdItem.id]
                                                                                                return <div className='opreat-box' key={index}>
                                                                                                    <Checkbox disabled={item.disabled} onChange={(e) => {
                                                                                                        this.onCheck(item, [newIndex,firstIndex, secondIndex, thirdIndex], 4, null, true)
                                                                                                        e.nativeEvent.stopImmediatePropagation();
                                                                                                    }} checked={!item.disabled&&item.checked?true:false} value={item.value} className='template-no-triger'>
                                                                                                        {item.label}
                                                                                                    </Checkbox>
                                                                                                </div>
                                                                                            })
                                                                                        }
                                                                                    </div> : <Fragment>
                                                                                        {
                                                                                            thirdItem.children && thirdItem.children.map((item, index) => {
                                                                                                item.r = {
                                                                                                    v:newItem.value,
                                                                                                   // label:newItem.label,
                                                                                                    c:{
                                                                                                        v: firstItem.value,
                                                                                                        // label: firstItem.label,
                                                                                                        c: {
                                                                                                            v: secondItem.value,
                                                                                                            // label: secondItem.label,
                                                                                                            c: {
                                                                                                                v: thirdItem.value,
                                                                                                              //  label: thirdItem.label,
                                                                                                                c: {
                                                                                                                    v: item.value,
                                                                                                                    // label: item.label,
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                };
                                                                                            })
                                                                                        }
                                                                                    </Fragment>
                                                                                }
                                                                            </div>:null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div> : <Fragment>
                                                            {
                                                                secondItem.children && secondItem.children.map((thirdItem, thirdIndex) => {
                                                                    thirdItem.r = {
                                                                        v: newItem.value,
                                                                        // label: newItem.label,
                                                                        c: {
                                                                            v: firstItem.value,
                                                                            // label: firstItem.label,
                                                                            c: {
                                                                                v: secondItem.value,
                                                                               // label: secondItem.label,
                                                                                c: {
                                                                                    v: thirdItem.value,
                                                                                    //label: thirdItem.label,
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                })}
                                                        </Fragment>
                                                }
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                            })}
                            
                        </div>
                    })
                }
               
                <div className='bottom-box'>
                    <Button type='primary' onClick={() => {
                        this.getValue(this.state.CitySevenRegion);
                    }}>确定</Button>
                    <Button className='cancle-btn' onClick={this.props.onCancel}>取消</Button>
                </div>
            </div>
        );
    }
}

export default AreaTemplate;
