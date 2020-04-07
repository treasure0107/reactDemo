import React, {Component} from 'react';
import {Modal, Button} from 'antd';
import Template from "../Template";

class AddFreightTemplateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: '',
      list: []
    }
  }

  componentDidMount() {

  }

  handleOk(e) {
    this.setState({
      visible: false,
    });
  };

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  };

  showModal() {
    this.setState({
      visible: true,
    });
  };

  getModalStatus(value) {
    if (value == 1) {
      this.props.onFreightTemplateModalValue(3)
    }
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button className="ml30 goods-btn" onClick={this.showModal.bind(this)}>新增运费模板 </Button>
        <Modal
          title="运费模板"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width={600}
          footer={null}
          wrapClassName={'freight-template-modal'}
        >
          <div>
            <Template goodsItem={1} onValue={this.getModalStatus.bind(this)}/>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddFreightTemplateModal;