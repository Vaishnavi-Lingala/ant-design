import React, { useState } from 'react';
import { Modal, Radio, Input, InputNumber, Form, Select, Checkbox, RadioChangeEvent, FormItemProps } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

import { formArgs } from './citrixformargs';
import { AppFormProps } from '../types';

function BrowserAppForm({ showModal, toggleModal }: AppFormProps) {
  const [isValidating, toggleValidating] = useState(false);
  const [form] = Form.useForm();

  // NOTE: Receives a onClick Event when pressing 'Ok' in the modal
  function onOk() {
    // NOTE: Async function, will wait to close modal until post req has sucessfully sent
    toggleValidating(true);
    form
      .validateFields()
      .then(values => {
        console.log("onOk", values)
        form.resetFields()
        toggleValidating(false);
        toggleModal();
      })
      .catch(err => {
        toggleValidating(false);
        console.error('Validate Failed:', err);
      });
  }

  function onCancel() {
    form.resetFields();
    toggleModal();
  }

  const handleRadioSelection = (e: RadioChangeEvent) => { }

  function FormItemWrapper({ label, rules, name, initialValue, children }: FormItemProps) {
    return (
      <Form.Item
        label={
          <span className='Modal-FormLabel'>
            {`${label} ${rules?.at(0) ? '*' : ''}`}
          </span>
        }
        initialValue={initialValue && initialValue}
        name={name}
        key={name as any}
        rules={rules}
        children={children}
      />
    );
  }

  function InputSelect(args) {
    switch (args.type) {

      case 'input':
        return (
          <FormItemWrapper {...args}>
            <Input />
          </FormItemWrapper>
        )

      case 'select':
        if (React.isValidElement(args.options)) {
          return (
            <FormItemWrapper {...args}>
              {args.options}
            </FormItemWrapper>
          );
        }

        return (
          <FormItemWrapper {...args}>
            <Select
              options={args.options}
            />
          </FormItemWrapper>
        );

      case 'radio':
        const RadioGroup = (
          <FormItemWrapper {...args}>
            <Radio.Group
              onChange={handleRadioSelection}
              options={args.options}
            />
          </FormItemWrapper>
        );

        args.options.forEach((opt) => console.log('render' in opt));

        if ('render' in args) {
          console.log('HELLO');
        }

        return (RadioGroup);

      case 'numeric':
        return (
          <FormItemWrapper {...args}>
            <InputNumber
              formatter={args.formatter}
              parser={args.parser}
              step={args.step}
            />
          </FormItemWrapper>
        );

      case 'checkbox':
        console.log(args);
        return (
          <FormItemWrapper {...args}>
            <Checkbox />
          </FormItemWrapper>
        );

      case 'heading':
        return (
          <>
            <h4 className='_SubHeading'>{args.label}</h4>
            <div className='Form-SubItemCard'>
              {
                args.children.map((childArgs) => (
                  <InputSelect {...childArgs} />
                ))
              }
            </div>
          </>
        );

      case 'dynamic':
        return (
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev[args.dependant] !== curr[args.dependant]}
          >
            {
              ({ getFieldValue }) => {
                console.log(getFieldValue(args.dependant))
                return (
                  <InputSelect {...args} />
                );
              }
            }
          </Form.Item>
        );

      default:
        return (
          <span>Input Type not yet supported.</span>
        );
    }
  }

  return (
    <Modal
      title={<span className='Modal-Header'>{formArgs.form_title}</span>}
      closeIcon={<CloseOutlined />}
      maskClosable={false}
      centered
      visible={showModal}
      onOk={onOk}
      onCancel={onCancel}
      okText={isValidating ? <LoadingOutlined /> : 'Add'}
    >
      <Form
        name='NewApp'
        labelCol={{ span: 9 }}
        labelAlign='left'
        autoComplete='off'
        size='small'
        form={form}
        requiredMark={false}
      >
        {
          formArgs.form_items.map((args) =>
            <InputSelect {...args} />
          )
        }
      </Form>
    </Modal>
  );
}

export default BrowserAppForm;
