import React, { useEffect, useRef, useState } from 'react';
import {Card, Button, List, Input, Row, Divider, Modal, message } from 'antd'

const testStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

function Test() {
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [editValue, setEditValue] = useState('')
  const [editIndex, setEditIndex] = useState(-1)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
    setIsReadOnly(true)
    setTimeout(() => {
      setIsReadOnly(false)
    }, 0)
  }, [isModalOpen])

  const onPressEnter = (e) => {
    // message.info(e.target.value)
    setData([...data, e.target.value])
    setInputValue('')
  }
  const clickItem = (item) => {
    const idx = data.indexOf(item)
    setEditValue(item)
    setEditIndex(idx)
    setIsModalOpen(true)
    console.log(item, idx)
  }
  const handleOk = () => {
    const newData = data
    newData[editIndex] = editValue
    setData(newData)
    setEditValue('')
    setEditIndex(-1)
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setEditValue('')
    setEditIndex(-1)
    setIsModalOpen(false);
  };

  const allClick = () => {
    if (!isModalOpen) {
      inputRef.current?.focus();
      setIsReadOnly(true)
      setTimeout(() => {
        setIsReadOnly(false)
      }, 0)
    }
  }

  return (
    <>
    {/* opacity: 0 */}
    <Input 
      value={inputValue} 
      readOnly={isReadOnly} 
      ref={inputRef} 
      onChange={(e) => setInputValue(e.target.value)} 
      onPressEnter={onPressEnter}
      style={{position: "absolute", width: "200px"}}
    />
    <div style={testStyle} onClick={allClick}>
      
      <Card style={{width: 400}}>
        
        <List
          size="small"
          header={<div>Header</div>}
          bordered
          dataSource={data}
          renderItem={item => <List.Item onClick={() => clickItem(item)}>{item}</List.Item>}
        />
      </Card>

      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
      </Modal>
    </div>
    </>
  )
}

export default Test