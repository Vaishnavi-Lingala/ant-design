import { Modal, Button, Radio, Input, Form, Select } from 'antd';
import { CloseOutlined } from "@ant-design/icons"

interface NFProps {
  showModal: boolean;
  toggleModal: () => void;
}

function NewAppForm({ showModal, toggleModal }: NFProps) {
  const [form] = Form.useForm();

  function onFinish() {

    toggleModal();
  }

  function onOk() {
    // NOTE: Async function, will wait to close modal until post req has sucessfully sent
    toggleModal();
  }

  function onCancel() {
    form.resetFields();
    toggleModal();
  }

  function FieldSwitch(value: string) {
    switch (value) {
      case 'pub':
        return (
          <Form.Item label='Published Resource Name:'>
            <Input />
          </Form.Item>
        )
      case 'desk':
        return (
          <Form.Item label='App Name:'>
            <Input />
          </Form.Item>
        )
      default:
        return null;
    }
  }

  return (
    <Modal
      title={<span className='Modal-Header'>Configure new App</span>}
      closeIcon={<Button><CloseOutlined /></Button>}
      maskClosable={false}
      centered
      visible={showModal}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        name='NewApp'
        labelCol={{ span: 9 }}
        labelAlign='left'
        onFinish={onFinish}
        autoComplete='off'
        size='small'
        form={form}
      >
        <Form.Item label='Application Type'>
          <Input.Group compact>

            <Form.Item noStyle name='app_type'>
              <Input style={{ width: '75%' }} />
            </Form.Item>

            <Form.Item noStyle>
              <Select defaultValue='VDI' style={{ width: '25%'}}>
                <Select.Option value='VDI'>VDI</Select.Option>
              </Select>
            </Form.Item>

          </Input.Group>
        </Form.Item>

        <Form.Item label='Citrix Storefront URL:' name='url'>
          <Input />
        </Form.Item>

        <Form.Item label='Citrix PNA Store URL:' name=''>
          <Input disabled placeholder='Determine where to place in database.' />
        </Form.Item>

        <Form.Item label='Citrix Gatewayt URL' name=''>
        </Form.Item>

        <Form.Item label='Window Title:' name='window_title'>
          <Input />
        </Form.Item>

        <Form.Item label='Resource Type' name='resource_type'>
          <Radio.Group>
            <Radio value='pub'>Published App</Radio>
            <Radio value='desk'>Desktop App</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev !== curr}
        >
          {({ getFieldValue }) => FieldSwitch(getFieldValue('resource_type'))}
        </Form.Item>

        <Form.Item label='Timeout:' name='wait_time'>
          <Input />
        </Form.Item>

        <Form.Item label='Domain:' name='domain'>
          <Input />
        </Form.Item>
      </Form >
    </Modal >
  );
}

export default NewAppForm;
