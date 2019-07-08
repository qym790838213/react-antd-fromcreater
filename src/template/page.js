import React, { Component } from 'react';
import { connect } from 'dva';
import FormCreater from '@/components/_pages_commons/FormCreater';
import { Table, Button, Row, Modal, message } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import { shuttleBusRequest } from '@/services/api';
import DownloadButton from '@/components/_pages_commons/DownloadButton'
import { doWithResponse, convertToSelectList, convertQueryParams, decodeSessionStorage } from '@/utils/utils';
import ModalForm from '@/components/_pages_commons/ModalForm';

const userInfo = decodeSessionStorage('userInfo');

const confirm = Modal.confirm;

const { getCityList } = shuttleBusRequest.common;
const { addNotifyMsg, editNotifyMsg } = shuttleBusRequest.operationManager;

@connect(({ templatemanager, loading }) => {
    return {
        ...templatemanager,
    };
})
export default class TemplateManager extends Component {
    state = {}
    componentDidMount () {
        this.props.dispatch({
            type: 'templatemanager/getDataList'
        })
    }
    renderModal () {
        let { currentItem, modalTypeStr, showItemModal, } = this.state;
        if (!currentItem) {
            return;
        }

        let addChildList = [
        ];
        let editChildList = addChildList;
        let modalBody = {
            title: {
                'ADD': '新建',
                'EDIT': '编辑'
            },
            childList: {
                'ADD': addChildList,
                'EDIT': editChildList
            },
            do: {
                'ADD': addNotifyMsg,
                'EDIT': editNotifyMsg
            }
        }
        return <ModalForm
            title={modalBody.title[modalTypeStr]}
            formChildList={modalBody.childList[modalTypeStr]}
            modalVisiable={showItemModal}
            onCancel={() => {
                this.setState({
                    showItemModal: false,
                    currentItem: null,
                    modalTypeStr: null,
                })
            }}
            okLoading={this.state.okLoading}
            onSubmit={values => {
                modalBody.do[modalTypeStr](Object.assign(currentItem, values)).then(res => doWithResponse(res, this.afterAjax.bind(this), null, true))
            }}
        />
    }
    afterAjax () {
        this.setState({
            currentItem: null,
            modalTypeStr: null,
        }, () => this.props.dispatch({
            type: 'templatemanager/getDataList'
        }))
    }
    onOperation (modalTypeStr, currentItem) {
        if (['ADD', 'EDIT'].includes(modalTypeStr)) {
            this.setState({
                modalTypeStr,
                currentItem,
                showItemModal: true
            })
            return;
        }
    }
    render () {
        let { pagination, dataList, queryData } = this.props;
        const columnsList = [];
        const searchChildList = [{
            key: 'keyword',
            span: 6,
            label: '线路编号',
            formItemType: 'input',
            placeholder: '请输入线路编号',
            initialValue: queryData.keyword
        },];
        return (
            <div>
                {this.renderModal()}
                <div className={'white_card search_paddingTop'}>
                    <FormCreater
                        onSubmit={e => {
                            e.pageNo = 1;
                            this.props.dispatch({ type: 'templatemanager/getDataList', payload: e })
                        }}
                        reset={() => {
                            let { pageNo, pageSize } = queryData;
                            this.props.dispatch({ type: 'templatemanager/setQueryData', payload: { pageNo, pageSize } })
                        }}
                        formType="searchFrom"
                        formItemLayout={{
                            labelCol: { span: 6 },
                            wrapperCol: { span: 14 },
                        }}
                        childList={searchChildList}
                    />
                </div>
                <div className={'white_card'}>
                    <div>
                        <Button icon="plus" onClick={() => router.push('/basemsg/templatemanager/addstation')} type='primary' style={{ margin: '10px' }}>添加站点</Button>
                        <DownloadButton url='/shuttle-bus-admin/stop/exportList' queryData={queryData} />
                    </div>
                    <Table
                        pagination={pagination}
                        onChange={pagination => {
                            let { current } = pagination;
                            this.props.dispatch({ type: 'templatemanager/getDataList', payload: { pageNo: current } })
                        }}
                        dataSource={dataList}
                        rowKey={record => record.stopId}
                        columns={columnsList}
                    />
                </div>
            </div>
        );
    }
}
