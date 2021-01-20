import React,{ useState } from 'react'

const FileSearch = ({ title, onFileSearch }) => {
    const [inputActive, setInputActive] = useState(false)
    const [value, setValue] = useState('')

    return (
        <>
            <div className="alert alert-primary">
                {
                    !inputActive &&
                    <div className="d-flex justify-content-between align-items-center">
                        <span >{title}</span>
                        <button type="button" className="btn btn-primary"
                                onClick={ ()=>{ setInputActive(true) }}
                        >
                            搜索
                        </button>
                    </div>
                }
                {
                    inputActive && 
                    <div className="d-flex justify-content-between align-items-center">
                        <input
                            className="form-control"
                            value={value}
                            style={ {width: 100} }
                        >
                        </input>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={ ()=>{ setInputActive(false) } }
                        >
                            关闭
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default FileSearch