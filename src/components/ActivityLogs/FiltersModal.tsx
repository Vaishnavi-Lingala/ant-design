import { Button, Col, Input, Modal, Row, Select } from "antd";
import Link from "antd/lib/typography/Link";
import { useEffect, useState } from "react";

const FilterRow = ({ id, closeClick, filterLength }) => (
    <Row style={{ marginTop: "10px" }} gutter={10}>
        <Col span={9}>
            <Input />
        </Col>
        <Col span={5}>
            <Select style={{ width: "100%" }} />
        </Col>
        <Col span={8}>
            <Input />
        </Col>
        <Col span={2}>
            <Button
                onClick={() => {
                    console.log({filterLength});
                    if (closeClick && filterLength > 1) {
                        closeClick(id);
                    }
                }}
            >
                X
            </Button>
        </Col>
    </Row>
);

const FilterRowGroup = ({ rowList, closeClick }) => (
    <Input.Group>{rowList.map((_rowItem, index) => <FilterRow key={index} id={index} closeClick={closeClick} filterLength={rowList.length} />)}</Input.Group>
);

export default function FiltersModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [list, setList] = useState([""]);

    function removeFilterById(id) {
        list.splice(id, 1);
        setList([...list]);
    }

    useEffect(() => {
        console.log({ list });
    }, [list]);

    return (
        <>
            <Link onClick={() => setIsVisible(true)}>Advanced Filters</Link>&nbsp;/&nbsp;<Link onClick={() => setList([""])}>Reset Filters</Link>
            <Modal
                visible={isVisible}
                onOk={() => setIsVisible(false)}
                onCancel={() => setIsVisible(false)}
                footer={false}
                width={700}
            >
                <h4>Advanced Filters</h4>
                <Button onClick={() => setList([""])}>Clear</Button>

                <FilterRowGroup rowList={list} closeClick={removeFilterById} />

                <Button
                    style={{ margin: "10px 0 10px 0" }}
                    onClick={() => {
                        setList([...list, ""]);
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
                    <Button type="primary" onClick={() => setIsVisible(false)}>
                        Apply Filters
                    </Button>
                    <Button onClick={() => setIsVisible(false)}>Cancel</Button>
                </div>
            </Modal>
        </>
    );
}
