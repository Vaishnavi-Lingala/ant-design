import { FunctionComponent, useState } from "react";
import { Input, Row, Col, Select, Button } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

import { userFilterFieldNames } from "../../constants";

interface FilterInputProps {
    filterInput: { field: string, value: string },
    index: number,
    filterableFields: Array<string>,
    options: object,
    onFilterFieldChange: (value) => void,
    onFilterValueChange: (value) => void,
    onCloseClick: () => void
}

const UsersFilterInput: FunctionComponent<FilterInputProps> = (props: FilterInputProps) => {
    const { index, filterInput, filterableFields, options, onFilterFieldChange, onFilterValueChange, onCloseClick } = props;
    const [fieldName, setFieldName] = useState("");

    return (<Input.Group key={index}>
        <Row style={{ marginTop: "10px" }} gutter={10}>
            <Col span={9}>
                <Select
                    showSearch
                    style={{ width: "100%" }}
                    value={filterInput.field}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={true}
                    onChange={(value) => {
                        setFieldName(value)
                        onFilterFieldChange(value);
                    }}
                    notFoundContent={null}
                >
                    {filterableFields.map((d) => (
                        <Select.Option key={d} value={d}>
                            {userFilterFieldNames[d]}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={5}>
                <Select
                    style={{ width: "100%" }}
                    value="equals"
                ></Select>
            </Col>
            <Col span={8}>
                {
                    fieldName !== "inactivity_in_days" ?
                        fieldName !== "is_enrolled" ?
                            fieldName !== "status" ?
                                <Input
                                    value={filterInput.value}
                                    onChange={(event) => {
                                        onFilterValueChange(
                                            event.target.value
                                        );
                                    }}
                                />
                                : <Select style={{ width: '210px' }}
                                    // showSearch
                                    // showArrow={false}
                                    value={filterInput.value}
                                    onChange={(value) => {
                                        onFilterValueChange(value)
                                    }}
                                >
                                    {
                                        Object.keys(options).map(key => {
                                            return <Select.Option key={key} value={key} >
                                                {options[key]}
                                            </Select.Option>
                                        })
                                    }
                                </Select>
                            : <Select style={{ width: '210px' }}
                                value={filterInput.value}
                                // showSearch
                                // showArrow={false}
                                onChange={(value) => {
                                    onFilterValueChange(value)
                                }}
                            >
                                <Select.Option key={1} value={true}>
                                    True
                                </Select.Option>
                                <Select.Option key={2} value={false}>
                                    False
                                </Select.Option>
                            </Select> :
                        <Select style={{ width: '210px' }}
                            value={filterInput.value}
                            // showSearch
                            // showArrow={false}
                            onChange={(value) => {
                                onFilterValueChange(value)
                            }}
                        >
                            <Select.Option key={30} value={30}>
                                30
                            </Select.Option>
                            <Select.Option key={60} value={60}>
                                60
                            </Select.Option>
                            <Select.Option key={90} value={90}>
                                90
                            </Select.Option>
                        </Select>
                }
            </Col>
            <Col span={2}>
                <Button icon={<DeleteOutlined />}
                    onClick={onCloseClick}
                >
                </Button>
            </Col>
        </Row>
    </Input.Group >);
}

export default UsersFilterInput;
