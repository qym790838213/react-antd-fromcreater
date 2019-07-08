import { shuttleBusRequest } from '@/services/api';
import { convertQueryParams } from '@/utils/utils'
import { message } from 'antd';
const { getStationList } = shuttleBusRequest.baseMsg;


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
            keyword: null,
            pageNo: 1,
            pageSize: 10,

        },
        dataList: []
    },
    effects: {
        *getDataList ({ payload }, { call, put, select }) {
            let { pagination, queryData } = yield select(state => state.templatemanager)
            if (!window.location.hash.split('?')[1]) {
                queryData = {
                    pageNo: 1,
                    pageSize: 10,
                }
            }
            let res = yield call(getStationList, Object.assign(queryData, payload));
            if (res.status === 200) {
                let { index, size, total, resultList } = res.data;
                yield put({ type: 'setPagination', payload: { ...pagination, current: index, total } });
                yield put({ type: 'setQueryData', payload: Object.assign(queryData, { pageNo: index }) })
                yield put({ type: 'setDataList', payload: resultList || [] })
            } else {
                message.error(res.msg);
            }
        },

    },
    reducers: {
        setPagination (state, action) {
            return {
                ...state,
                pagination: action.payload
            }
        },
        setQueryData (state, action) {
            location.hash = (convertQueryParams(window.location.hash.split('?')[0], action.payload))
            return {
                ...state,
                queryData: action.payload
            }
        },
        setDataList (state, action) {
            return {
                ...state,
                dataList: action.payload,
            }
        }
    }

}