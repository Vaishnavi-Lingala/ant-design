import { FunctionComponent } from "react";
import { Input, Row, Col, Select, Button } from "antd";

import { filterableFieldNames } from "../../constants";

interface FilterInputProps {
    filterInput: { field: string, value: string },
    index: number,
    filterableFields: Array<string>,
    onFilterFieldChange: (value) => void,
    onFilterValueChange: (value) => void,
    onCloseClick: () => void
}

const FilterInput: FunctionComponent<FilterInputProps> = (props: FilterInputProps) => {
    const { index, filterInput, filterableFields, onFilterFieldChange, onFilterValueChange, onCloseClick } = props;

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
                <Input
                    value={filterInput.value}
                    onChange={(event) => {
                        onFilterValueChange(
                            event.target.value
                        );
                    }}
                />
            </Col>
            <Col span={2}>
                <Button
                    onClick={onCloseClick}
                >
                    X
                </Button>
            </Col>
        </Row>
    </Input.Group>);
}

export default FilterInput;
