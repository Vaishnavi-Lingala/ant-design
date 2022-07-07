import { FunctionComponent, useState } from "react";
import { Input, Row, Col, Select, Button } from "antd"
import { DeleteOutlined } from '@ant-design/icons';

import { filterableFieldNames } from "../../constants";

interface FilterInputProps {
    filterInput: { field: string, value: string },
    index: number,
    filterableFields: Array<string>,
    machineTypeOptions: object,
    onFilterFieldChange: (value) => void,
    onFilterValueChange: (value) => void,
    onCloseClick: () => void
}

const FilterInput: FunctionComponent<FilterInputProps> = (props: FilterInputProps) => {
    const { index, filterInput, filterableFields, machineTypeOptions, onFilterFieldChange, onFilterValueChange, onCloseClick } = props;
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
                        setFieldName(value);
                        onFilterFieldChange(value);
                    }}
                    notFoundContent={null}
                >
                    {filterableFields.map((d) => (
                        <Select.Option key={d} value={d}>
                            {filterableFieldNames[d]}
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
                    fieldName !== "machine_type" ?
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
                                Object.keys(machineTypeOptions).map(key => {
                                    return <Select.Option key={key} value={key} >
                                        {machineTypeOptions[key]}
                                    </Select.Option>
                                })
                            }
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
    </Input.Group>);
}

export default FilterInput;
