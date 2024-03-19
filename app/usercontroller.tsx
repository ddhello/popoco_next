"use client"
import { Modal } from "antd";
import { useState } from "react";


export default function UserControllers() {
    const [isModalOpen,setIsModalOpen] = useState(true)
    const handleOK = () => {
        setIsModalOpen(false)
    }
    return (
        <Modal
            title="用户操作"
            open={isModalOpen}
            onOk={handleOK}
        >
        </Modal>
    )
}