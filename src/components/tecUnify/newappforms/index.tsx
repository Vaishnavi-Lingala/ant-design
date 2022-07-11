import { useState } from 'react';
import { Modal, Radio, Input, InputNumber, Form, Select, Checkbox, FormItemProps } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

import { formArgs } from './browserappformargs';
import { AppFormProps } from '../types';

function AppFormRenderer({ showModal, toggleModal }: AppFormProps) {
  const [isValidating, toggleValidating] = useState(false);
  const [form] = Form.useForm();

  function onOk() {
    // Async function, will wait to close modal until validation is complete and
    // the fields have been sucessfully sent
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

  // Wraps the child field in a Form.Item component
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

  // Select different components based on the type of input provided
  function InputSelect(args: any) {
    switch (args.type) {

      case 'input':
        return (
          <FormItemWrapper {...args}>
            <Input />
          </FormItemWrapper>
        )

      case 'select':

        return (
          <FormItemWrapper {...args}>
            <Select
              options={args.options}
            />
          </FormItemWrapper>
        );

      case 'radio':
        return (
          <FormItemWrapper {...args}>
            <Radio.Group
              options={args.options}
            />
          </FormItemWrapper>
        );

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
        return (
          <FormItemWrapper {...args}>
            <Checkbox />
          </FormItemWrapper>
        );

      case 'heading':
        return <h4 className='_SubHeading'>{args.label}</h4>;

      case 'custom':
        return (args.render);

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

export default AppFormRenderer;
