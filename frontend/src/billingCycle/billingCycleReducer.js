const INITIAL_STATTE = { list: [] }

export default (state = INITIAL_STATTE, action) => {
    switch (action.type) {
        case 'BILLING_CYCLES_FETCHED':
            //pegando tudo, e depois só mudando a lista
            return { ...state, list: action.payload.data }
        default:
            return state
    }
}