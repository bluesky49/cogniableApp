/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */


import React, { useEffect, useState } from 'react'
import { Form, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import CKEditor from "react-ckeditor-component";
import './targetFrom.scss'

const CREATE_TARGET = gql`
  mutation masterTarget(
    $domainId: ID!
    $targetAreaId: ID!
    $targetname: String!
    $targetInstr: String!
    $video: String
  ) {
    masterTarget(
      input: {
        domainId: $domainId
        targetAreaId: $targetAreaId
        targetName: $targetname
        targetInstr: $targetInstr
        video: $video
      }
    ) {
      target {
        id
        targetInstr
        targetMain {
          targetName
        }
        video
      }
    }
  }
`

const TargetForm = ({
  domainId,
  targetAreaId,
  form,
  setNewTarget,
  handelNewTargetDrawer,
  name,
  instr,
  video = ''
}) => {
  const [createTarget, { data, loading, error }] = useMutation(CREATE_TARGET)

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Clinic Curriculam',
        description: 'New Target Added Successfully',
      })
      setNewTarget({ node: data.masterTarget.target })
      form.resetFields()
      handelNewTargetDrawer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Something went wrong!',
        description: 'creating target ',
      })
    }
  }, [error])

   const [instrvalue, setValue] = useState(instr);

   useEffect(() => {
     try
     {
       setValue(JSON.parse(instr))
     }
     catch(err)
       {
          setValue(instr)
       }


   }, [instr])

   function onEditorChange(evt) {
    instr = evt.editor.getData();
     setValue(evt.editor.getData())
   }


  const handleSubmit = e => {
    e.preventDefault()
    // eslint-disable-next-line no-shadow
    form.validateFields((error, value) => {
      if (!error) {
        createTarget({
          variables: {
            domainId,
            targetAreaId,
            targetname: value.targetname,
            targetInstr: JSON.stringify(instrvalue),
            video: value.videolink
          },
        })
      }
    })
  }




  return (
    <Form name="targetForm" onSubmit={handleSubmit}>
      <Form.Item label="Target Name">
        {form.getFieldDecorator('targetname', {
          initialValue: name,
          rules: [{ required: true, message: 'Please enter Target Name' }],
        })(<Input placeholder="Target Name" size="large" />)}
      </Form.Item>
      <Form.Item label="Target Instructions">
      <CKEditor
            activeClass="p10"
            content={instrvalue}
            events={{
                "change":onEditorChange
              }}
            config={{
              height:450
            }}
           />
      </Form.Item>
      <Form.Item label="Target Video Link">
        {form.getFieldDecorator('videolink', {
          initialValue: video,
        })(<Input placeholder="Target Video Link" size="large" />)}
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        style={{ marginTop: 15, fontSize: 16, width: '100%', height: 40 }}
      >
        Create Target
      </Button>
    </Form>
  )
}

export default Form.create()(TargetForm)
