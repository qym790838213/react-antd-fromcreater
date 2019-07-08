import React from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import moment from 'moment';
import { Card, Button, Table, Modal } from 'antd';
import FormCreater from '@/components/_page_common/FormCreater';
import { doWithResponse, convertToSelectList } from '@/utils/utils';

@connect(({
    loading,
    templatemanager
}) => {
    return {
        loading: loading.models.templatemanager,
        ...templatemanager
    };
})
export default class Templatemanager extends React.Component {
    constructor(props) {
        super(props);
        this.onFormRef = React.createRef()
    }
    state = {
        showItemModal: false,
        modalType: null,
        currentItem: null,
    }
    renderModal () {
        let { showItemModal, modalType, currentItem } = this.state;
        if (!currentItem) {
            return;
        }
        let childList = []
        let modalBody = {
            "ADD": {
                title: '添加',
                childList
            },
            "MODIFY": {
                title: '修改',
                childList
            },
        }
        return <Modal maskClosable={true} centered={true} footer={null} title={modalBody[modalType].title} visible={showItemModal} onCancel={this.hideModal.bind(this)}>
            <FormCreater onRef={ref => this.onFormRef = ref} isColumn={true} leftBtn={modalType === 'SET' ? <Button onClick={this.hideModal.bind(this)}>取消</Button> : null} rightBtn={modalType === 'SET' ? <Button type="primary" htmlType={"submit"}>确定</Button> : null} onSubmitText="确定" onSubmit={(values) => {

            }} dataList={modalBody[modalType].childList} />
        </Modal>
    }
    onOperation (modalType, currentItem) {
        this.setState({
            modalType,
            currentItem,
            showItemModal: true
        })
    }
    hideModal () {
        this.setState({
            showItemModal: false,
            currentItem: null,
            modalType: ''
        })
    }
    afterAjax () {
        this.props.dispatch({ type: 'templatemanager/getDataList' })
        this.setState({
            showItemModal: false,
            modalType: null,
            currentItem: null,
            currentMode: null
        })
    }
    render () {
        let { queryData, pagination, dataList, dispatch } = this.props;
        let searchList = [
            { key: 'orgName', label: '关键字', initialValue: queryData.orgName, formItemType: 'input', placeholder: '请输入公司名称' },
        ];
        let columnList = []
        return <PageHeaderLayout>
            <div className="tableList">
                {this.renderModal()}
                <Card bordered={false}>
                    <FormCreater isColumn={false} onSubmit={(values) => {
                        dispatch({ type: 'templatemanager/getDataList', payload: Object.assign({ index: 1 }, values) })
                    }} dataList={searchList} />
                    <Button icon="plus" type="primary" style={{ margin: "10px" }} onClick={this.onOperation.bind(this, 'ADD', {})}>添加</Button>
                    <Table
                        columns={columnList}
                        dataSource={dataList}
                        pagination={pagination}
                        rowKey={(record, index) => index + ''}
                        onChange={(pagination) => {
                            let { current } = pagination;
                            dispatch({ type: 'templatemanager/getDataList', payload: { current } })
                        }}
                    />
                </Card>

            </div>
        </PageHeaderLayout>
    }
} 