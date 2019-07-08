import { getOrgList, addOrg } from '@/services/api3';
import { doWithResponse } from '@/utils/utils';
import { message } from 'antd';


export default {
    namespace: 'templatemanager',
    state: {
        pagination: {
            current: 1,
            total: 0,
            pageSize: 10,
            showQuickJumper: true,
            showTotal: total => `共${total}条数据`,
        },
        queryData: {
            city: null,
            orgName: null,
            index: 0,
            current: 1,
            size: 10,
        },
        dataList: []
    },
    effects: {
        *getDataList ({ payload = {} }, { call, put, select }) {
            let { queryData, pagination } = yield select(state => state.templatemanager);
            let newQueryData = Object.assign(queryData, payload);
            let newObj = Object.assign({}, queryData)
            newObj.index = (newObj.current - 1) * 10;
            let res = yield call(getOrgList, newObj);
            if (res.meta.code === 1) {
                yield put({ type: 'setDataList', payload: res.data.list || [] })
                yield put({ type: 'setQueryData', payload: newQueryData })
                yield put({ type: 'setPagination', payload: Object.assign(pagination, { total: res.data.count, current: newQueryData.current || 1 }) })
            } else {
                message.error(res.meta.desc);
            }
        },

    },
    reducers: {
        setDataList (state, action) {
            return {
                ...state,
                dataList: action.payload
            }
        },
        setPagination (state, action) {
            return {
                ...state,
                pagination: action.payload
            }
        },
        setQueryData (state, action) {
            return {
                ...state,
                queryData: action.payload
            }
        }
    }
}