import React from 'react'
import {connect} from 'react-redux'
import {editor} from '../actions/index'

class EditorHeader extends React.Component {
    constructor(props) {
        super(props)
        this.submit = this.props.submit 
        this.titleChange = this.titleChange.bind(this)
        this.editTitle = this.editTitle.bind(this)
        this.titleFocusOut = this.titleFocusOut.bind(this)
    }

    componentWillMount() {
        this.setState({titleDisabled:true})
    }

    componentDidMount() {
        if(this.props.edit.title) {
            this.refs.titleField.value = this.props.edit.title
        }
    }

    titleChange(event) {
        this.props.onEdit({
            ...this.props.edit,
            title : event.target.value
        })
    }

    editTitle(event) {
        this.setState({titleDisabled:false})
    }

    titleFocusOut(event) {
        const title = event.target.value
        console.log(title)
        if(!title) {
            this.refs.titleField.focus()
        } else {
            this.setState({titleDisabled:true})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(!this.state.titleDisabled) {
            this.refs.titleField.focus()
        }
    }
    
    render() {
        return (
            <div className='bg-editor-header'>
                <input 
                    type='text' 
                    className='bg-editor-title-input' 
                    placeholder=' Please Enter a title' 
                    ref='titleField' 
                    onChange={this.titleChange} 
                    disabled={this.state.titleDisabled} 
                    onBlur={this.titleFocusOut}
                />

                <div className='bg-editor-title-edit-button' onClick={this.editTitle}>
                    <i className='fas fa-pen-square'></i>
                </div>
                <div className='bg-editor-submit-post-button' onClick={this.submit}>
                    <i className='fas fa-save'></i>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        edit: state.edit
    }
} 

function mapDispatchToProps(dispatch) {
    return {
        onEdit: (edit) => dispatch(editor(edit))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader)
