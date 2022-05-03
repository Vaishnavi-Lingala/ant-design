import { Button, Modal } from "antd";
import Link from "antd/lib/typography/Link";
import { useEffect, useState } from "react";

export default function FiltersModal() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <Link onClick={() => setIsVisible(true)}>
                Advanced Filters
            </Link>
            <Modal
                title="Advanced Filters"
                visible={isVisible}
                onOk={() => setIsVisible(false)}
                onCancel={() => setIsVisible(false)}
                footer={[
                    <Button type="primary" onClick={() => setIsVisible(false)}>
                        Apply Filters
                    </Button>,
                    <Button onClick={() => setIsVisible(false)}>Cancel</Button>,
                ]}
                width={700}
            >
                Advanced Filters Container
            </Modal>
        </>
    );
}
