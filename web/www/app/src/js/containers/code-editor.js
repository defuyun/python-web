import React from 'react'
import AceEditor from 'react-ace'
import {connect} from 'react-redux'
import {editorContentChange} from 'actions/actions'

import 'brace/mode/markdown'
import 'brace/theme/cobalt'
import 'brace/keybinding/vim'

class CodeEditor extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    onChange(value) {
        this.props.edit(value)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.content !== nextProps.content) {
            return true
        }
        return false
    }

    render() {
        return (
            <AceEditor
                mode="markdown"
                theme="cobalt"
                keyboardHandler="vim"
                name="doge-editor"
                showPrintMargin={false}
                wrapBehavioursEnabled={true}
                wrapEnabled={true}
                editorProps={{
                    $blockScrolling:Infinity
                }}
                onChange={this.onChange.bind(this)}
                value={this.props.content}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        content: state.editorContent
    }
}

function mapDispatchToProps(dispatch) {
    return {
        edit: (content) => dispatch(editorContentChange(content))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor)