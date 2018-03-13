import React from 'react'

export default (text) => {
    return {
        type : 'EDITOR_CHANGE_INPUT',
        text
    }
}