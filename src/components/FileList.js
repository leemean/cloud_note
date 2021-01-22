import React,{ useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrash,faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'

const FileList = ( { files, onFileClick, onSaveEdit, onFileDelete }) => {

    const [editStatus, setEditStatus] = useState(false)
    const [value, setValue] = useState('')
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    const closeEdit = (editItem) => {
        console.log('close edit')
        //e.preventDefault()
        setEditStatus(false)
        setValue('')
        if(editItem.isNew){
            onFileDelete(editItem.id)
        }
    }

    useEffect(()=>{
        // const handleInputEvent = (event) => {
        //     const { keyCode } = event
        //     if(keyCode === 13 && editStatus) {
        //         const editItem = files.find(file => file.id === editStatus)
        //         onSaveEdit(editItem.id,value)
        //     } else if(keyCode === 27 && editStatus){
        //         closeEdit(event)
        //     }
        // }
        // document.addEventListener('keyup',handleInputEvent)
        // return () => { 
        //     document.removeEventListener('keyup', handleInputEvent)
        // }
        const editItem = files.find(file => file.id === editStatus)
        if(enterPressed && editStatus && value.trim() !== '' ){
            onSaveEdit(editItem.id,value)
            setEditStatus(false)
            closeEdit(editItem)
        }
        if(escPressed && editStatus){
            closeEdit(editItem)
        }
    })

    useEffect(()=>{
        const newFile = files.find(p=>p.isNew)
        if(newFile){
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    },[files])

    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map( file => (
                    <li className="list-group-item bg-light row d-flex align-items-center file-item mx-0" key={file.id}>
                        { ((file.id !== editStatus) && !file.isNew) &&
                        <>
                            <span className="col-2"><FontAwesomeIcon icon={faMarkdown} size="lg" ></FontAwesomeIcon></span>
                            <span className="col-6 c-link" onClick={ () => { onFileClick(file.id) } }>{file.title}</span>
                            <button
                                type="button"
                                className="icon-button col-2"
                                onClick={ ()=>{ setEditStatus(file.id); setValue(file.title)  } }
                            >
                                <FontAwesomeIcon icon={faEdit} title="编辑" size="lg" ></FontAwesomeIcon>
                            </button>
                            <button 
                                type="button" 
                                className="icon-button col-2"
                                onClick={ () => { onFileDelete(file.id) } }
                            >
                                <FontAwesomeIcon icon={faTrash} title="删除" size="lg" ></FontAwesomeIcon>
                            </button>
                        </>
                         }
                         { ((file.id === editStatus) || file.isNew) &&
                            <>
                                <input
                                    className="form-control col-10"
                                    value={value}
                                    placeholder="请输入文件名称..."
                                    onChange={ (e)=>{ setValue(e.target.value) } }
                                >
                                </input>
                                <button 
                                    type="button" 
                                    className="icon-button col-2"
                                    onClick={ ()=> { closeEdit(file) } }
                                >
                                    <FontAwesomeIcon icon={faTimes} title="关闭" size="lg" ></FontAwesomeIcon>
                                </button>
                            </>
                         }
                    </li>
                ))
            }
        </ul>
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func
}

export default FileList