import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { reset as resetForm, initialize } from 'redux-form' //limpar os dados do form
import { showTabs, selectTab } from '../common/tab/tabActions'

const BASE_URL = 'http://localhost:3002/api'
const INITIAL_VALUES = { credits: [{}], debts: [{}] }

export function getList() {
    const request = axios.get(`${BASE_URL}/billingCycles`)
    return {
        //toda action, precisa ter um type
        type: 'BILLING_CYCLES_FETCHED',
        payload: request
    }
}

export function create(values) {
    return submit(values, 'post')

}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}

//só vai ser usada dentro desse modulo
function submit(values, method) {
    return dispatch => {

        const id = values._id ? values._id : '' //quando for update

        //axios['post'] ou ['put']
        axios[method](`${BASE_URL}/billingCycles/${id}`, values)
            //.then -> sucesso
            .then(resp => {
                toastr.success('Sucesso', 'Operação realizada com sucesso!')
                dispatch(init())
            })
            //catch -> erro
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export function showUpdate(billingCycle) {
    return [
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        //"chamando" o form para a aba update
        initialize('billingCycleForm', billingCycle)
    ]
}

export function showDelete(billingCycle) {
    return [
        showTabs('tabDelete'),
        selectTab('tabDelete'),
        //"chamando" o form para a aba update
        initialize('billingCycleForm', billingCycle)
    ]
}

//estado inicial do ciclo de pagamentos
export function init() {
    return [
        showTabs('tabList', 'tabCreate'),
        selectTab('tabList'),
        getList(),
        initialize('billingCycleForm', INITIAL_VALUES)
    ]
}