import { useState } from 'react';
import { Modal, Radio, Input, InputNumber, Form, Select, Checkbox, FormItemProps } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

import { ApiResError, FormArgs } from '../types';
import ApiService from '../../../Api.service';
import ApiUrls from '../../../ApiUtils';
import { openNotification } from '../../Layout/Notification';

export interface AppFormProps {
  showModal: boolean;
  toggleModal: () => void;
  formArgs?: FormArgs;
  appUID?: string;
}

function AppFormRenderer({ showModal, toggleModal, formArgs, appUID }: AppFormProps) {
  const [isValidating, toggleValidating] = useState(false);
  const [form] = Form.useForm();

  if (formArgs === undefined) {
    return <></>
  }

  function onOk() {
    toggleValidating(true);
    form
      .validateFields()
      .then(values => {
        toggleValidating(false);

        // addTemplate(values)
        //   .then((res) => console.log('On Ok', res))
        //   .catch((err: ApiResError) => {
        //     console.error(err)
        //     openNotification('error', 'Error sending data to server.');
        //   });
      })
      .catch((err: ApiResError) => {
        toggleValidating(false);
        console.error('Validate Failed:', err);
      });
  }

  async function addTemplate(values: any) {
    const accountId = localStorage.getItem('accountId');

    if (appUID !== undefined && accountId !== null) {
      const res = await ApiService
        .post(ApiUrls.addTemplate(accountId, appUID), values)

      if ('errorSummary' in res)
        throw res;

      return res;
    }
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
            <Select options={args.options} />
          </FormItemWrapper>
        );

      case 'radio':
        return (
          <FormItemWrapper {...args}>
            <Radio.Group options={args.options} />
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
      title={<span className='Modal-Header'>{formArgs.formTitle}</span>}
      closeIcon={<CloseOutlined />}
      maskClosable={false}
      centered
      visible={showModal}
      onOk={onOk}
      onCancel={onCancel}
      okText={isValidating ? <LoadingOutlined /> : 'Add'}
      destroyOnClose
    >
      <Form
        name='NewApp'
        labelCol={{ span: 9 }}
        labelAlign='left'
        autoComplete='off'
        size='small'
        form={form}
        validateMessages={formArgs.validationMessages}
        requiredMark={false}
      >
        {formArgs.formItems.map((args) => <InputSelect {...args}/>)}
      </Form>
    </Modal>
  );
}

export default AppFormRenderer;
