import { useState } from 'react';
import { Modal, Radio, Input, InputNumber, Form, Select, Checkbox, FormItemProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { ApiResError, FormItem } from '../types';
import ApiService from '../../../Api.service';
import ApiUrls from '../../../ApiUtils';
import { openNotification } from '../../Layout/Notification';
import { useFormSwitch } from '../hooks';

export interface AppFormProps {
  showModal: boolean;
  toggleModal: () => void;
  defaultValues?: any;
  appUID: string;
  templateType?: string;
}

const accountId = localStorage.getItem('accountId');

function AppFormRenderer({ showModal, toggleModal, appUID, templateType, defaultValues }: AppFormProps) {
  const [sendingData, toggleSendingData] = useState(false);
  const [form] = Form.useForm();

  const { formArgs } = useFormSwitch({
    templateType
  });

  console.log(formArgs);
  if (formArgs === undefined || appUID === undefined) {
    return <></>
  }

  function onOk() {
    form.validateFields()
      .then(values => {
        toggleSendingData(true)
        updateDB(values)
          .then((res) => console.log('On Ok', res))
          .catch((err: ApiResError) => {
            console.error(err)
            openNotification('error', 'Error sending data to server.');
          })
          .finally(() =>
            toggleSendingData(false)
          );

        console.log(values);
      })
      .catch((err: ApiResError) => {
        console.error('Validate Failed:', err);
      });
  }

  async function updateDB(values: any) {
    if (accountId !== null) {
      let res: any;

      defaultValues ?
        res = await ApiService.put(ApiUrls.updateTemplate(accountId, appUID), values)
        :
        res = await ApiService.post(ApiUrls.addTemplate(accountId, appUID), values)

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
  function FormItemWrapper({ label, rules, name, children}: FormItemProps) {
    return (
      <Form.Item
        label={
          <span className='Modal-FormLabel'>
            {`${label} ${rules?.at(0) ? '*' : ''}`}
          </span>
        }
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
      confirmLoading={sendingData}
      okText={<span>Add</span>}
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
        initialValues={defaultValues}
        colon={false}
      >
        {formArgs.formItems.map((args, index) => <InputSelect {...args} key={index} />)}
      </Form>
    </Modal>
  );
}

export default AppFormRenderer;
