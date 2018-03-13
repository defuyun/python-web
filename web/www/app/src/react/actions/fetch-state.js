const getSideNav = (options) => {
    return {
        type : 'FETCH_SIDENAV_OPTIONS_SUCCESS',
        options
    }
}

export default () => (dispatch) => {
    fetch('/sidenav_options')
    .then((response) => 
        response.json()
    )
    .then((responseJson) => {
        const data = responseJson.data
        dispatch(getSideNav(data))
    })
    .catch((error) => {
        console.log(error)
    })
}