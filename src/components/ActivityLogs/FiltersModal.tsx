import { Button, Col, Input, Modal, Row, Select } from "antd";
import Link from "antd/lib/typography/Link";
import { useEffect, useState } from "react";
import ApiService from "../../Api.service";
import ApiUtils from "../../ApiUtils";

export default function FiltersModal({ onFilterApply, onResetClick }) {
    const initialFilterInput = { field: "", value: "" };

    const [isVisible, setIsVisible] = useState(false);
    const [filterableFields, setFilterableFields] = useState([""]);
    const [filterInputs, setFilterInputs] = useState([initialFilterInput]);
    const [appliedFilterCount, setAppliedFilterCount] = useState(0);

    useEffect(() => {
        (async function () {
            var response = await ApiService.get(ApiUtils.filterableFields);
            setFilterableFields([...response]);
        })();
    }, []);

    useEffect(() => {
        setAppliedFilterCount(
            filterInputs.filter(
                (filterInput) =>
                    filterInput.field !== "" &&
                    filterInput.value !== ""
            ).length
        );
    }, [filterInputs]);

    const onFilterOptionChange = (field, index) => {
        setFilterInputs((state) => {
            const values = [...state];
            values[index].field = field;
            return values;
        });
    };

    const onFilterValueChange = (value, index) => {
        setFilterInputs((state) => {
            const values = [...state];
            values[index].value = value;
            return values;
        });
    };

    const onApplyFiltersClick = () => {
        setIsVisible(false);

        setFilterInputs([
            ...filterInputs.filter((filterInput) => filterInput.value !== ""),
        ]);

        setAppliedFilterCount(
            filterInputs.filter(
                (filterInput) =>
                    filterInput.field !== "" && filterInput.value !== ""
            ).length
        );

        const optimisedFiltersObj = filterInputs.map((filterInput) => {
            if (filterInput.field !== "" && filterInput.value !== "") {
                return { [filterInput.field]: [filterInput.value] };
            }
        });

        const reducedOptimisedFiltersObj = optimisedFiltersObj.reduce(
            (r, c) => Object.assign(r, c),
            {}
        );
        onFilterApply(reducedOptimisedFiltersObj);
    };

    return (
        <>
            <Link onClick={() => setIsVisible(true)}>
                Advanced Filters{" "}
                {appliedFilterCount !== 0 ? `(${appliedFilterCount})` : null}
            </Link>
            &nbsp;/&nbsp;
            <Link
                onClick={() => {
                    setFilterInputs([initialFilterInput]);
                    onResetClick();
                }}
            >
                Reset Filters
            </Link>
            <Modal
                visible={isVisible}
                onOk={() => setIsVisible(false)}
                onCancel={() => {
                    setIsVisible(false);
                    setFilterInputs([initialFilterInput]);
                }}
                footer={false}
                width={700}
            >
                <h4>Advanced Filters</h4>

                <Button
                    onClick={() => {
                        setFilterInputs([initialFilterInput]);
                    }}
                >
                    Clear
                </Button>

                {filterInputs.map((filterInput, index) => (
                    <Input.Group key={index}>
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
                                        onFilterOptionChange(value, index);
                                    }}
                                    notFoundContent={null}
                                >
                                    {filterableFields.map((d) => (
                                        <Select.Option key={d} value={d}>
                                            {d}
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
                                            event.target.value,
                                            index
                                        );
                                    }}
                                />
                            </Col>
                            <Col span={2}>
                                <Button
                                    onClick={() => {
                                        setFilterInputs((state) => {
                                            const values = [...state];
                                            values.splice(index, 1);
                                            return values;
                                        });
                                    }}
                                >
                                    X
                                </Button>
                            </Col>
                        </Row>
                    </Input.Group>
                ))}

                <Button
                    style={{ margin: "10px 0 10px 0" }}
                    onClick={() => {
                        setFilterInputs((state) => [
                            ...state,
                            initialFilterInput,
                        ]);
                    }}
                >
                    Add Filter
                </Button>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                    }}
                >
                    <Button type="primary" onClick={onApplyFiltersClick}>
                        Apply Filters
                    </Button>
                    <Button
                        onClick={() => {
                            setIsVisible(false);
                            setFilterInputs([initialFilterInput]);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
        </>
    );
}
