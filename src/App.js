import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from "./utils/defaultFiles"
import BottomBtn from './components/BottomBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faFileImport } from '@fortawesome/free-solid-svg-icons'
import TabList from './components/TabList'
import SimpleMDE from 'react-simplemde-editor'
import "easymde/dist/easymde.min.css";
import { useState } from 'react';
import uuidv4 from 'uuid/dist/v4'
import { flattenArr,objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'

const { join } = window.require('path')
const { remote } = window.require('electron')

function App() {

  const [ files, setFiles] = useState(flattenArr(defaultFiles))
  const [ activeFileID, setActiveFileID] = useState('')
  const [ openedFileIDs, setOpenedFileIDs] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [ searchedFiles, setSearchedFiles] = useState([])

  //arr
  const filesArr = objToArr(files)

  const saveLocation = remote.app.getPath('documents')

  const fileClick = (fileID) => {
    //set current active file
    setActiveFileID(fileID)
    //add new fileID to openedFiles
    if(!openedFileIDs.includes(fileID)){
      setOpenedFileIDs([...openedFileIDs,fileID])
    }
  }

  const tabClick = (fileID) => {
    setActiveFileID(fileID)
  }

  const tabClose = (fileID) => {
    const tabsWithOut = openedFileIDs.filter( id => id !== fileID )
    setOpenedFileIDs(tabsWithOut)
    //set first open
    if(tabsWithOut.length > 0){
      setActiveFileID(tabsWithOut[0])
    } else {
      setActiveFileID([])
    }
  }

  const fileChange = (id,value) => {
    if(value !== files[id].body) {
      const newFile = { ...files[id],body: value }
      setFiles({ ...files,[id]: newFile })
      if(!unsavedFileIDs.includes(id)){
          setUnsavedFileIDs([...unsavedFileIDs, id])
      }
    }
  }

  const deleteFile = (id) => {
    delete files[id]
    setFiles(files)
    //close tab if opened
    tabClose(id)
  }

  const updateFileName = (id,title,isNew) => {
    const modifiedFile = { ...files[id], title, isNew: false }
    if(isNew){
      fileHelper.writeFile(join(saveLocation,`${title}.md`), files[id].body).then(()=>{
        setFiles({...files,[id]: modifiedFile })
      })
    }else{
      fileHelper.renameFile(join(saveLocation,`${files[id].title}.md`),join(saveLocation,`${title}.md`)).then(()=>{
        setFiles({...files,[id]: modifiedFile })
      }) 
    }
  }

  const fileSearch = (keyWord) => {
      const newFiles = filesArr.filter(p=>p.title.includes(keyWord))
      setSearchedFiles(newFiles)
  } 

  const createNewFile = () => {
    const newID = uuidv4()
    // const newFiles = [
    //   ...files,
    //   {
    //     id: newID,
    //     title: '',
    //     body: '##请输入 Markdown',
    //     createdAt: new Date().getTime(),
    //     isNew: true
    //   }
    // ]
    // setFiles(newFiles)
    const newFile = {
      id: newID,
      title: '',
      body: '## 请输出 Markdown',
      isNew: true,
      createAt: new Date().getTime()
    }
    const newFiles = { ...files, [newID] : newFile }
    console.log(newFiles)
    setFiles(newFiles)
    console.log(files)
  }

  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr

  return (
    <div className="App container-fluid px-0">
      <div className="row row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch onFileSearch={ (keyWord) => { fileSearch(keyWord) } } />
          <FileList 
              files={ fileListArr } 
              onFileClick={ (id) => { fileClick(id) } }
              onFileDelete={ (id) => { deleteFile(id)  } }
              onSaveEdit = { (id,newValue) => { updateFileName(id,newValue); } }
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn text="新建" colorClass="btn-primary" icon={ faPlus } onBtnClick={ ()=>{ createNewFile() } } />
            </div>
            <div className="col">
              <BottomBtn text="导入" colorClass="btn-success" icon={ faFileImport } />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {
            !activeFile && 
            <div className="start-page">
              选择或者创建新的Markdown文档
            </div>
          }
          { activeFile &&
            <>
              <TabList 
                files={ openedFiles }
                activeId={ activeFileID }
                unsaveIds={ unsavedFileIDs }
                onTabClick={ (id)=>{ tabClick(id)  } }
                onCloseTab={ (id)=> { tabClose(id) } }
              />
              <SimpleMDE 
                key = { activeFile && activeFile.id }
                value={ activeFile && activeFile.body }
                onChange={ (value) => { fileChange(activeFileID,value) } }
                options={
                  {
                    minHeight: '515px'
                  }
                }
              />
            </>
          }

        </div>
      </div>
    </div>
  );
}

export default App;
