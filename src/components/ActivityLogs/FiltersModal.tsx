import { useEffect, useState } from "react";
import { Button, Modal} from "antd";
import Link from "antd/lib/typography/Link";

import FilterInput from "./FilterInput";
import ApiUtils from "../../ApiUtils";
import ApiService from "../../Api.service";

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
                <p style={{ fontWeight: 600, fontSize: 'medium'}}>Advanced Filters</p>

                <Button
                    onClick={() => {
                        setFilterInputs([initialFilterInput]);
                    }}
                >
                    Clear
                </Button>

                {filterInputs.map((filterInput, index) => (
                    <FilterInput
                        key={index}
                        filterableFields={filterableFields}
                        filterInput={filterInput}
                        index={index}
                        onFilterFieldChange={(value) => onFilterOptionChange(value, index)}
                        onFilterValueChange={(value) => onFilterValueChange(value, index)}
                        onCloseClick={() => {
                            setFilterInputs((state) => {
                                const values = [...state];
                                if (values.length > 1)
                                    values.splice(index, 1);
                                return values;
                            });
                        }}
                    />
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
