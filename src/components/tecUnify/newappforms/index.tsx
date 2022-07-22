import { useState } from 'react';
import {
  Modal,
  Radio,
  Input,
  InputNumber,
  Form, Select,
  Checkbox,
  Upload,
  FormItemProps,
  Divider,
  UploadProps,
  message
} from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

import { ApiResError } from '../types';
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

async function updateDB(values: any, appUID: string, hasDefaultVals: boolean) {
  if (accountId !== null) {
    let res: any;

    // If form has default values then we need to update the template
    // otherwise add a new entry to the DB
    if (hasDefaultVals) {
      res = await ApiService.put(ApiUrls.updateTemplate(accountId, appUID), values)
    }
    else {
      res = await ApiService.post(ApiUrls.addTemplate(accountId, appUID), values)
    }

    if ('errorSummary' in res)
      throw res;

    return res;
  }
}

function AppFormRenderer({
  showModal,
  toggleModal,
  appUID,
  templateType,
  defaultValues
}: AppFormProps) {

  const [sendingData, toggleSendingData] = useState(false);
  const [image, setImage] = useState<string>();
  const [form] = Form.useForm();

  const { formArgs } = useFormSwitch({
    templateType
  });

  if (formArgs === undefined || appUID === undefined) return <></>

  // Converting uploaded file to base64 string to pass through API
  function blobToBase64(file: Blob) {
    const reader = new FileReader();

    // function to run when the reader finishes loading the file
    reader.onload = (event) => {
      let bString: string = '';
      if (event.target !== null)
        bString = event.target.result as string;

      form.setFieldsValue({ new_logo: btoa(bString) })
      setImage(btoa(bString))
    };

    reader.onerror = () =>
      message.error('There was a problem preparing the Image.')

    reader.readAsBinaryString(file);
  }

  const uploadSettings: UploadProps = {
    fileList: undefined,
    maxCount: 1,
    showUploadList: false,
    listType: 'picture-card',
    beforeUpload: file => {
      const isPngOrJpg = file.type === 'image/png' || file.type === 'image/jpeg';

      if (!isPngOrJpg)
        message.error('Please upload a file in the correct format.');

      const aboveSizeLimit = file.size / 1024 / 1024 < 1;
      if (!aboveSizeLimit)
        message.error('File size is too large.')

      blobToBase64(file);
      return isPngOrJpg && aboveSizeLimit
    },
    onRemove: () => {
      return undefined
    },
    // Avoid using the default upload methods
    customRequest: () => { }
  }

  function onOk() {
    form.validateFields()
      .then(values => {
        toggleSendingData(true)
        updateDB(values, appUID, defaultValues !== undefined)
          .then((res) => {
            console.log('On Ok', res)
          })
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

  function onCancel() {
    form.resetFields();
    toggleModal();
  }

  // Wraps the child field in a Form.Item component
  const FormItemWrapper: React.FC<FormItemProps> = ({ label, rules, name, children }) => {
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
  FormItemWrapper.displayName = 'Form Item Wrapper';

  // Select different components based on the type of input provided
  const InputSelect: React.FC<any> = (args) => {
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
  Input.displayName = 'Input Switch';

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
        <Divider>App logo</Divider>


        <h4 style={{textAlign: 'center'}}>Requirments</h4>
        <div className='Modal-UploadRulesContainer'>
          <ul className='Modal-UploadRules'>
            <li>Images should be less than 1mb</li>
            <li>Images should be png or jpeg format</li>
          </ul>

          <ul className='Modal-UploadRules'>
            <li>Transparent background</li>
            <li>Minimum image size of 420x120px</li>
          </ul>
        </div>

        <Form.Item name='new_logo' getValueFromEvent={uploadSettings.onRemove}>
          <Upload {...uploadSettings}>
            {
              image ?
                <img
                  alt='App logo'
                  src={`data:image/png;base64,${image}`}
                  style={{ height: '100%' }}
                />
                :
                uploadButton
            }
          </Upload>
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default AppFormRenderer;
