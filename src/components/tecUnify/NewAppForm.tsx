import { useState } from 'react';
import { Modal, Radio, Input, InputNumber, Form } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { formArgs } from './citrixformargs';

interface AppFormProps {
  showModal: boolean;
  toggleModal: () => void;
}

function NewAppForm({ showModal, toggleModal }: AppFormProps) {
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
      }
      );
  }

  function onCancel() {
    form.resetFields();
    toggleModal();
  }

  function FieldSwitch(value: string) {
    switch (value) {
      case 'pub':
        return (
          <Form.Item
            label={<span className='Modal-FormLabel'>Published App Name*</span>}
            name='published_app_name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        )
      case 'desk':
        return (
          <Form.Item
            label={<span className='Modal-FormLabel'>App Name*</span>}
            name='app_name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        )
      default:
        return null;
    }
  }

  return (
    <Modal
      title={<span className='Modal-Header'>Configure Citrix VDI App</span>}
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
        validateMessages={formArgs.validationMessages}
        requiredMark={false}
      >

        {
          formArgs.input.map((args) =>
            <Form.Item
              label={
                <span className='Modal-FormLabel'>
                  {`${args.label} ${args.rules?.at(0)?.required ? '*' : ''}`}
                </span>
              }
              name={args.name}
              key={args.name}
              rules={args.rules}
            >
              <Input disabled={args.disabled} placeholder={args.placeholder} />
            </Form.Item>
          )
        }

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev !== curr}
        >
          {({ getFieldValue }) => FieldSwitch(getFieldValue('resource_type'))}
        </Form.Item>

        <Form.Item
          label={<span className='Modal-FormLabel'>Resource Type</span>}
          name='resource_type'
        >
          <Radio.Group>
            <Radio value='pub'>Published App</Radio>
            <Radio value='desk'>Desktop App</Radio>
          </Radio.Group>
        </Form.Item>

        {
          formArgs.number.map((args) =>
            <Form.Item
              label={<span className='Modal-FormLabel'>{args.label}</span>}
              name={args.name}
              key={args.name}
              initialValue={args.initialValue}
            >
              <InputNumber
                formatter={args.formatter}
                parser={args.parser}
                step={100}
              />
            </Form.Item>
          )
        }

      </Form >
    </Modal >
  );
}

export default NewAppForm;
