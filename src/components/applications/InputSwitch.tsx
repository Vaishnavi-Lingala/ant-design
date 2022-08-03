import {
  Checkbox,
  Form,
  FormItemProps,
  Input,
  InputNumber,
  Radio,
  Select
} from "antd";

// Wraps the child field in a Form.Item component
const FormItemWrapper: React.FC<FormItemProps> = ({ label, rules, name, children, ...props }) => {
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
      {...props}
    />
  );
}
FormItemWrapper.displayName = 'Form Item Wrapper';

// Select different components based on the type of input provided
const InputSelect: React.FC<any> = ({className, ...args}) => {
  switch (args.type) {
    case 'input':
      return (
        <FormItemWrapper {...args}>
          <Input className={className} />
        </FormItemWrapper>
      )

    case 'select':
      return (
        <FormItemWrapper {...args}>
          <Select options={args.options} className={className} />
        </FormItemWrapper>
      );

    case 'radio-group':
      return (
        <FormItemWrapper {...args}>
          <Radio.Group options={args.options} className={className} />
        </FormItemWrapper>
      );

    case 'numeric':
      return (
        <FormItemWrapper {...args}>
          <InputNumber
            formatter={args.formatter}
            parser={args.parser}
            step={args.step}
            className={className}
          />
        </FormItemWrapper>
      );

    case 'checkbox':
      return (
        <FormItemWrapper {...args}>
          <Checkbox className={className} />
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
InputSelect.displayName = 'Input Switch';

export default InputSelect;
